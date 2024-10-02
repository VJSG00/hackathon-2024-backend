import { Request, Response } from 'express';
import InventarioMensual from '../models/Inventarios/InventarioMensual';
import { Op } from 'sequelize';
import InventarioActual from '../models/Inventarios/InventarioActual';

export const getInventarioMensual = async (req: Request, res: Response) => {
    try {
        const inventario = await InventarioMensual.findAll();
        res.status(200).json(inventario);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching inventario mensual' });
    }
};


// Controladores Avanzados

export const populateInventarioMensual = async (req: Request, res: Response) => {
    try {
        console.log('Iniciando la población del inventario mensual...');
        const { mes } = req.body;
        console.log('Mes recibido:', mes);

        // Eliminar el inventario mensual existente
        await InventarioMensual.destroy({ where: {} });
        console.log('InventarioMensual existente eliminado.');

        const inventarioActual = await InventarioActual.findAll({ where: { mes } });
        console.log('InventarioActual encontrado:', inventarioActual);

        for (const item of inventarioActual) {
            const Data = item.dataValues;
            console.log('Procesando item de InventarioActual:', Data);

            await InventarioMensual.create({
                nombreMedicamento: Data.nombreMedicamento,
                recibidas: Data.cantidad, 
                demanda: Data.demanda,
                esencial: Data.esencial,
                marca: Data.marca,
                club: Data.club
            });
            console.log(`InventarioMensual creado para medicamento ${Data.nombreMedicamento}`);
        }

        res.status(201).json({ message: 'Inventario mensual populated successfully' });
        console.log('Población del inventario mensual completada.');
    } catch (error) {
        console.error('Error al poblar el inventario mensual:', error);
        res.status(500).json({ error: 'Error populating inventario mensual' });
    }
};
