import { Request, Response } from 'express';
import Entrega from '../models/Entrega.model';

// import del controlador avanzado:
import Donante from '../models/Donante.model';
import Medicamento from '../models/Medicamento.model';
import Paciente from '../models/Paciente.model';
import EntregaMedicamentos from '../models/EntregaMedicamentos.model';
import db from '../config/db';
import jwt from 'jsonwebtoken';
import Usuarios from '../models/Usuarios.model';
import { AuthEmail } from '../emails/AuthEmail';

// controladores basicos
export const getEntregas = async (req: Request, res: Response) => {
    const entregas = await Entrega.findAll({
        order: [
            ['id', 'DESC']
        ]
    });
    res.json({ data: entregas });
};

export const getEntregaById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const entrega = await Entrega.findByPk(id, {
        include: [
            { model: Medicamento, through: { attributes: [] } },
            { model: Paciente, through: { attributes: [] } }
        ]
    });
    if (!entrega) {
        return res.status(404).json({ message: 'Entrega no encontrada' });
    }
    res.json({ data: entrega });
};


export const updateEntrega = async (req: Request, res: Response) => {
    const { id } = req.params;
    const entrega = await Entrega.findByPk(id);

    if (!entrega) {
        return res.status(404).json({
            error: 'Entrega No Encontrada'
        });
    }

    await entrega.update(req.body);
    await entrega.save();
    res.json({ data: entrega });
};

export const deleteEntrega = async (req: Request, res: Response) => {
    const { id } = req.params;
    const entrega = await Entrega.findByPk(id);

    if (!entrega) {
        return res.status(404).json({
            error: 'Entrega No Encontrada'
        });
    }

    await entrega.destroy();
    res.json({ data: 'Entrega Eliminada' });
};

// controladores avanzados
export const createFullEntrega = async (req: Request, res: Response) => {
    const { entregaData, donanteData, medicamentosData, cantidadUnidades } = req.body;

    console.log('Datos recibidos:', { entregaData, donanteData, medicamentosData, cantidadUnidades });

    const transaction = await db.transaction();
    try {
        // Buscar o crear el donante
        let donante = await Donante.findOne({ where: { nombre: donanteData.nombre }, transaction });
        console.log('Donante encontrado:', donante);
        if (!donante) {
            donante = await Donante.create(donanteData, { transaction });
            console.log('Donante creado:', donante);
            const data = donante.dataValues;
            const role: 'Donante' = 'Donante';
            const token = jwt.sign({ email: data.correo, role }, process.env.JWT_SECRET, { expiresIn: '24h' });

            // Crear el usuario asociado al donante
            await Usuarios.create({ email: data.correo, password: '', role, donanteCorreo: data.correo, idDonante: data.id }, { transaction });
            await AuthEmail.sendConfirmationEmail({ email: data.correo, name: data.nombre, token });
        }

        // Crear la entrega
        const entrega = await Entrega.create({
            ...entregaData,
            idDonante: donante.id,
            cantidadUnidades // Aseguramos que cantidadUnidades se pase correctamente
        }, { transaction });
        console.log('Entrega creada:', entrega);

        // Crear múltiples entradas de medicamentos y asociarlas a la entrega
        for (let i = 0; i < medicamentosData.length; i++) {
            const medData = medicamentosData[i];
            const cantidad = cantidadUnidades[i];
            console.log(`Procesando medicamento: ${medData.nombre}, cantidad: ${cantidad}`);

            for (let j = 0; j < cantidad; j++) {
                const medicamento = await Medicamento.create({
                    ...medData,
                    idDonante: donante.id
                }, { transaction });
                console.log('Medicamento creado:', medicamento);

                await EntregaMedicamentos.create({
                    idEntrega: entrega.id,
                    idMedicamento: medicamento.id
                }, { transaction });
                console.log('Asociación Entrega-Medicamento creada:', { idEntrega: entrega.id, idMedicamento: medicamento.id });
            }
        }

        await transaction.commit();
        res.status(201).json({ data: entrega });
    } catch (error) {
        await transaction.rollback();
        console.error('Error al crear la entrega completa:', error);
        res.status(500).json({ error: 'Error al crear la entrega completa' });
    }
};
