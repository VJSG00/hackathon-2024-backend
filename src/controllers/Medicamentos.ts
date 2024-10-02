import { Request, Response } from 'express';
import Medicamento from '../models/Medicamento.model';
import Paciente from '../models/Paciente.model';
import db from '../config/db';
import InventarioActual from '../models/Inventarios/InventarioActual';
import InventarioMensual from '../models/Inventarios/InventarioMensual';
import { AuthEmail } from '../emails/AuthEmail';

export const getMedicamentos = async (req: Request, res: Response) => {
    const medicamentos = await Medicamento.findAll({
        order: [
            ['id', 'DESC']
        ]
    });
    res.json({ data: medicamentos });
};

export const getMedicamentoById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento) {
        return res.status(404).json({
            error: 'Medicamento No Encontrado'
        });
    }
    res.json({ data: medicamento });
};

export const createMedicamento = async (req: Request, res: Response) => {
    const medicamento = await Medicamento.create(req.body);
    res.status(201).json({ data: medicamento });
};

export const updateMedicamento = async (req: Request, res: Response) => {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id);

    if (!medicamento) {
        return res.status(404).json({
            error: 'Medicamento No Encontrado'
        });
    }

    await medicamento.update(req.body);
    await medicamento.save();
    res.json({ data: medicamento });
};

export const deleteMedicamento = async (req: Request, res: Response) => {
    const { id } = req.params;
    const medicamento = await Medicamento.findByPk(id);

    if (!medicamento) {
        return res.status(404).json({
            error: 'Medicamento No Encontrado'
        });
    }

    await medicamento.destroy();
    res.json({ data: 'Medicamento Eliminado' });
};

export const asignarMedicamentos = async (req: Request, res: Response) => {
    const { identificador, valorIdentificador, nombreMedicamento, cantidad, fechaPaciente } = req.body;

    console.log('Datos recibidos para asignación:', { identificador, valorIdentificador, nombreMedicamento, cantidad, fechaPaciente });

    const transaction = await db.transaction();
    try {
        // Verificar que el paciente existe según el identificador
        let paciente;
        if (identificador === 'cedula') {
            paciente = await Paciente.findOne({ where: { cedula: valorIdentificador }, transaction });
        } else if (identificador === 'p.nacimiento') {
            paciente = await Paciente.findOne({ where: { partidaNacimiento: valorIdentificador }, transaction });
        }

        if (!paciente) {
            console.log('Paciente no encontrado');
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        console.log('Paciente encontrado:', paciente.dataValues);

        // Buscar medicamentos disponibles
        const medicamentos = await Medicamento.findAll({
            where: {
                nombre: nombreMedicamento,
                idPaciente: null
            },
            limit: cantidad,
            transaction
        });

        console.log('Medicamentos disponibles encontrados:', medicamentos);

        // Verificar que los medicamentos tienen la propiedad marca
        const marca = medicamentos[0]?.dataValues?.marca || 'Generico';

        let inventarioActual = await InventarioActual.findOne({
            where: { nombreMedicamento, marca },
            transaction
        });

        if (!inventarioActual) {
            // Crear un nuevo inventario si no existe
            inventarioActual = await InventarioActual.create({
                nombreMedicamento,
                marca: 'Generico',
                cantidad: 0,
                demanda: cantidad,
                esencial: true,
                mes: 'Desconocido',
                club: ["Otro"],
                precioUnidad: 0
            }, { transaction });
            console.log('Inventario creado:', inventarioActual.dataValues);

            // Devolver respuesta ya que no hay medicamentos disponibles
            await transaction.commit();
            return res.status(200).json({ message: 'Inventario creado y demanda registrada', demanda: cantidad });

        } else {
            const dataInventario = inventarioActual.dataValues;
            console.log('Inventario actual encontrado:', dataInventario);

            let demanda = cantidad;
            if (medicamentos.length < cantidad) {
                console.log('Demanda adicional:', demanda);
                await inventarioActual.update({ demanda: dataInventario.demanda + demanda, cantidad: 0 }, { transaction });
            } else {
                const nuevaCantidad = dataInventario.cantidad - cantidad;
                await inventarioActual.update({ cantidad: nuevaCantidad, demanda: dataInventario.demanda + demanda }, { transaction });
            }

            // Asignar medicamentos al paciente y actualizar fechaPaciente
            for (const medicamento of medicamentos) {
                await medicamento.update({ idPaciente: paciente.id, fechaPaciente }, { transaction });
                console.log('Medicamento asignado:', medicamento.dataValues);
            }



            await AuthEmail.EmailAsignación({
                email: paciente.dataValues.correo,
                name: paciente.dataValues.nombreCompleto,
                cantidad,
                fechaPaciente,
                nombreMedicamento
            });

            await transaction.commit();
            res.status(200).json({ message: 'Medicamentos asignados correctamente y correo enviado', demanda });
        };
    } catch (error) {
        await transaction.rollback();
        console.error('Error al asignar medicamentos:', error);
        res.status(500).json({ error: 'Error al asignar medicamentos' });
    }
}
