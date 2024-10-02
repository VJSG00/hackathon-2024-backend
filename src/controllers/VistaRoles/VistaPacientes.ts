import { Request, Response } from 'express';
import Paciente from '../../models/Paciente.model';
import Medicamento from '../../models/Medicamento.model';

export const getPacienteInfo = async (req: Request, res: Response) => {
    const { idPaciente } = req.params;

    try {
        console.log('ID del paciente recibido:', idPaciente);

        // Información del paciente
        const paciente = await Paciente.findByPk(idPaciente);
        if (!paciente) {
            console.log('Paciente no encontrado');
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }
        console.log('Información del paciente:', paciente.dataValues);

        // Medicamentos asignados
        const medicamentosAsignados = await Medicamento.findAll({
            where: { idPaciente },
            attributes: ['nombre', 'presentacion', 'marca', 'tipo', 'fechaPaciente']
        });
        console.log('Medicamentos asignados encontrados:', medicamentosAsignados);

        // Formatear la información de los medicamentos
        const medicamentos = medicamentosAsignados.map(med => {
            const medData = med.dataValues;
            console.log('Procesando medicamento:', medData);
            return {
                nombre: medData.nombre,
                presentacion: medData.presentacion,
                marca: medData.marca,
                tipo: medData.tipo,
                estatus: medData.fechaPaciente ? `Asignado para el ${new Date(medData.fechaPaciente).toLocaleDateString()}` : 'No asignado'
            };
        });
        console.log('Medicamentos formateados:', medicamentos);

        // Notificación de retiro de medicamentos
        const today = new Date();
        let proximosRetiro = null;
        for (let i = 0; i < medicamentosAsignados.length; i++) {
            const medData = medicamentosAsignados[i].dataValues;
            if (medData.fechaPaciente) {
                const fechaPaciente = new Date(medData.fechaPaciente);
                if (fechaPaciente > today && (!proximosRetiro || fechaPaciente < proximosRetiro)) {
                    proximosRetiro = fechaPaciente;
                }
            }
        }

        console.log('Próximo retiro de medicamentos:', proximosRetiro);

        res.status(200).json({
            paciente,
            medicamentos,
            proximosRetiro: proximosRetiro ? proximosRetiro.toLocaleDateString() : null
        });
    } catch (error) {
        console.error('Error al obtener la información del paciente:', error);
        res.status(500).json({ error: 'Error al obtener la información del paciente' });
    }
};


