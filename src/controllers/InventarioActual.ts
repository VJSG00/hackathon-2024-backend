import { Request, Response } from 'express';
import InventarioActual from '../models/Inventarios/InventarioActual';
import Medicamento from '../models/Medicamento.model';
import Entrega from '../models/Entrega.model';
import { Op } from 'sequelize';


export const getInventarioActual = async (req: Request, res: Response) => {
    try {
        const inventario = await InventarioActual.findAll();
        res.status(200).json(inventario);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching inventario actual' });
    }
};


export const populateInventarioActual = async (req: Request, res: Response) => {
    try {
        console.log('Iniciando la población del inventario actual...');

        // Buscar medicamentos disponibles.
        const medicamentos = await Medicamento.findAll();
        console.log('Medicamentos encontrados:', medicamentos);

        const inventarioMap = new Map();

        for (const medicamento of medicamentos) {
            const Data = medicamento.dataValues;
            console.log('Procesando medicamento:', Data);

            if (!Data.nombre || !Data.marca) {
                console.error('Datos incompletos para el medicamento:', Data);
                continue;
            }

            const key = `${Data.nombre}-${Data.marca}`;
            if (!inventarioMap.has(key)) {
                inventarioMap.set(key, {
                    cantidad: 0,
                    demanda: 0,
                    esencial: Data.esencial !== null ? Data.esencial : false,
                    mes: Data.fechaDonante ? new Date(Data.fechaDonante).toLocaleString('default', { month: 'long' }) : 'Desconocido',
                    club: Data.tipo || ["Desconocido"], // Usar el tipo del medicamento como club
                    marca: Data.marca,
                    precioUnidad: Data.precio || 0
                });
            }

            const inventario = inventarioMap.get(key);
            inventario.cantidad += Data.idPaciente === null ? 1 : 0;
            inventario.demanda += Data.idPaciente !== null ? 1 : 0;
        }

        for (const [key, inventario] of inventarioMap.entries()) {
            const [nombre, marca] = key.split('-');
            const existingInventario = await InventarioActual.findOne({ where: { nombreMedicamento: nombre, marca } });

            if (existingInventario) {
                // Actualizar el inventario existente
                await existingInventario.update({
                    cantidad: inventario.cantidad,
                    demanda: (existingInventario.demanda || 0) + inventario.demanda,
                    esencial: inventario.esencial,
                    mes: inventario.mes,
                    club: inventario.club,
                    precioUnidad: inventario.precioUnidad
                });
                console.log(`InventarioActual actualizado para medicamento ${nombre} de marca ${marca}`);
            } else {
                // Crear un nuevo inventario si no existe
                await InventarioActual.create({
                    nombreMedicamento: nombre,
                    cantidad: inventario.cantidad,
                    demanda: inventario.demanda,
                    esencial: inventario.esencial,
                    mes: inventario.mes,
                    club: inventario.club,
                    marca: inventario.marca,
                    precioUnidad: inventario.precioUnidad
                });
                console.log(`InventarioActual creado para medicamento ${nombre} de marca ${marca}`);
            }
        }

        res.status(201).json({ message: 'Inventario actual populated successfully' });
        console.log('Población del inventario actual completada.');
    } catch (error) {
        console.error('Error al poblar el inventario actual:', error);
        res.status(500).json({ error: 'Error populating inventario actual' });
    }
};
