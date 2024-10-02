import { Request, Response } from 'express';
import Donante from '../models/Donante.model';
import Usuarios from '../models/Usuarios.model';
import { AuthEmail } from '../emails/AuthEmail';
import jwt from 'jsonwebtoken';

export const getDonantes = async (req: Request, res: Response) => {
    const donantes = await Donante.findAll({
        order: [
            ['id', 'DESC']
        ]
    });
    res.json({ data: donantes });
};

export const getDonanteById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const donante = await Donante.findByPk(id);
    if (!donante) {
        return res.status(404).json({
            error: 'Donante No Encontrado'
        });
    }
    res.json({ data: donante });
};

export const updateDonante = async (req: Request, res: Response) => {
    const { id } = req.params;
    const donante = await Donante.findByPk(id);

    if (!donante) {
        return res.status(404).json({
            error: 'Donante No Encontrado'
        });
    }

    await donante.update(req.body);
    await donante.save();
    res.json({ data: donante });
};

export const deleteDonante = async (req: Request, res: Response) => {
    const { id } = req.params;
    const donante = await Donante.findByPk(id);

    if (!donante) {
        return res.status(404).json({
            error: 'Donante No Encontrado'
        });
    }

    await donante.destroy();
    res.json({ data: 'Donante Eliminado' });
};

// Controladores avanzados:

export const createDonante = async (req: Request, res: Response) => {
    try {
        const donante = await Donante.create(req.body);
        const data = donante.dataValues
        const role: 'Donante' = 'Donante';
        const token = jwt.sign({ email: data.correo, role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        await Usuarios.create({ email: data.correo, password: '', role, idDonante: data.id });
        await AuthEmail.sendConfirmationEmail({ email: data.correo, name: data.nombre, token });

        res.status(201).json({ data: donante });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
