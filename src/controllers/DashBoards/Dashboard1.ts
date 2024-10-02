import express from 'express';
import { Op } from 'sequelize';
import Paciente from '../../models/Paciente.model';
import Donante from '../../models/Donante.model';
import Entrega from '../../models/Entrega.model';
import Medicamento from '../../models/Medicamento.model';
import Sequelize from 'sequelize';
import { authenticate, verifyRole } from '../../middleware/authMiddleware';
import InventarioActual from '../../models/Inventarios/InventarioActual';

const Dashrouter = express.Router();

// Dashrouter.use(authenticate);
// Dashrouter.use(verifyRole('Gestor'));

Dashrouter.get('/dashboard-data', async (req, res) => {
    try {
        const pacientesActivos = await Paciente.count({ where: { status: 'Activo' } });
        const totalPacientes = await Paciente.count();
        const totalDonantes = await Donante.count();
        const totalEntregas = await Entrega.count();

        const medicamentosMasSolicitados = await Medicamento.findAll({
            attributes: ['nombre', [Sequelize.fn('COUNT', Sequelize.col('nombre')), 'value']],
            group: ['nombre'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('nombre')), 'DESC']],
            limit: 3
        });

        const comunidadesConMasPeticiones = await Entrega.findAll({
            attributes: ['comunidad', [Sequelize.fn('COUNT', Sequelize.col('comunidad')), 'value']],
            group: ['comunidad'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('comunidad')), 'DESC']],
            limit: 3
        });

        const clubesDeEnfermedadesComunes = await Paciente.findAll({
            attributes: ['enfermedadesCronicas', [Sequelize.fn('COUNT', Sequelize.col('enfermedadesCronicas')), 'value']],
            group: ['enfermedadesCronicas'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('enfermedadesCronicas')), 'DESC']],
            limit: 4
        });

        const pacientes = await Paciente.findAll({
            where: { status: 'Activo' },
            attributes: ['id', 'nombreCompleto', 'fechaNacimiento', 'telefono', 'cedula', 'enfermedadesCronicas', 'comunidad', 'status']
        });

        const medicamentosPorMes = await Entrega.findAll({
            attributes: [
                [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('fechaDonante')), 'mes'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad']
            ],
            group: ['mes'],
            order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('fechaDonante')), 'ASC']]
        });
        console.log('Medicamentos por mes:', medicamentosPorMes);

        const donantesPorMes = await Medicamento.findAll({
            attributes: [
                [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('fechaDonante')), 'mes'],
                [Sequelize.fn('COUNT', Sequelize.col('idDonante')), 'cantidad']
            ],
            group: ['mes'],
            order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('fechaDonante')), 'ASC']]
        });
        console.log('Donantes por mes:', donantesPorMes);

        const inventario = await InventarioActual.findAll();
        let totalDemanda = 0;
        let totalCantidad = 0;
        inventario.forEach(item => {
            totalDemanda += item.demanda;
            totalCantidad += item.cantidad;
        });
        const porcentajeDemandaAbastecida = totalDemanda > 0 ? (totalCantidad / totalDemanda) * 100 : 0;
        console.log('Porcentaje de demanda abastecida:', porcentajeDemandaAbastecida);


        res.json({
            pacientesActivos,
            totalPacientes,
            totalDonantes,
            totalEntregas,
            medicamentosMasSolicitados,
            comunidadesConMasPeticiones,
            clubesDeEnfermedadesComunes,
            pacientes,
            medicamentosPorMes,
            donantesPorMes,
            porcentajeDemandaAbastecida

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los datos del dashboard' });
    }
});

export default Dashrouter;
