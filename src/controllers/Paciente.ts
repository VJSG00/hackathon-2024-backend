import { Request, Response } from 'express';
import Paciente from '../models/Paciente.model';
import { AuthEmail } from '../emails/AuthEmail';
import Usuarios from '../models/Usuarios.model';
import jwt from 'jsonwebtoken';

export const getPacientes = async (req: Request, res: Response) => {
    const pacientes = await Paciente.findAll({
        order: [
            ['id', 'DESC']
        ]
    });
    res.json({ data: pacientes });
};

export const getPacienteById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const paciente = await Paciente.findByPk(id);
    if (!paciente) {
        return res.status(404).json({
            error: 'Paciente No Encontrado'
        });
    }
    res.json({ data: paciente });
};


export const updatePaciente = async (req: Request, res: Response) => {
    const { id } = req.params;
    const paciente = await Paciente.findByPk(id);

    if (!paciente) {
        return res.status(404).json({
            error: 'Paciente No Encontrado'
        });
    }

    await paciente.update(req.body);
    await paciente.save();
    res.json({ data: paciente });
};

export const deletePaciente = async (req: Request, res: Response) => {
    const { id } = req.params;
    const paciente = await Paciente.findByPk(id);

    if (!paciente) {
        return res.status(404).json({
            error: 'Paciente No Encontrado'
        });
    }

    await paciente.destroy();
    res.json({ data: 'Paciente Eliminado' });
};

// controladores avanzados:


export const createPaciente = async (req: Request, res: Response) => {
    try {
        const paciente = await Paciente.create(req.body);
        const data = paciente.dataValues 
        const role: 'Paciente' = 'Paciente';
        const token = jwt.sign({ email: data.correo, role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        //console.log({ email: data.correo, password: '', role })
        await Usuarios.create({ email: data.correo, password: '', role, idPaciente: data.id })
        await AuthEmail.sendConfirmationEmail({ email: data.correo, name: data.nombreCompleto, token });

        res.status(201).json({ data: paciente });
    } catch (error) {
        console.error('Error en la creación del paciente y usuario:', error);
        res.status(500).json({ error: error.message });
    }
};
