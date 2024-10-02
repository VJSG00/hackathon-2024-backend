import { Request, Response } from 'express';
import Donante from '../../models/Donante.model';
import Entrega from '../../models/Entrega.model';
import Medicamento from '../../models/Medicamento.model';
import InventarioActual from '../../models/Inventarios/InventarioActual';
import Paciente from '../../models/Paciente.model';


export const getDonanteInfo = async (req: Request, res: Response) => {
    const { idDonante } = req.params;
    console.log('ID del Donante:', idDonante);
    
    try {
        // Información del donante
        const donante = await Donante.findByPk(idDonante, {
            attributes: ['id', 'nombre', 'telefono', 'correo', 'frecuencia', 'tipo', 'observaciones']
        });
        console.log('Información del Donante:', donante?.dataValues);
        if (!donante) {
            return res.status(404).json({ error: 'Donante no encontrado' });
        }

        // Fecha de la última donación
        const ultimaEntrega = await Entrega.findOne({
            where: { idDonante },
            order: [['fechaDonante', 'DESC']],
            attributes: ['id', 'fechaDonante', 'idDonante', 'cantidadUnidades', 'motivo', 'comunidad', 'observaciones']
        });
        console.log('Última Entrega:', ultimaEntrega?.dataValues);

        // Número total de donaciones
        const totalDonaciones = await Entrega.count({ where: { idDonante } });
        console.log('Total de Donaciones:', totalDonaciones);

        // Número de pacientes atendidos
        const pacientesAtendidos = await Medicamento.count({
            where: { idDonante },
            distinct: true,
            col: 'idPaciente'
        });
        console.log('Pacientes Atendidos:', pacientesAtendidos);

        // Medicamentos esenciales más demandados
        const medicamentosEsenciales = await InventarioActual.findAll({
            where: { esencial: true },
            order: [['demanda', 'DESC']],
            limit: 3,
            attributes: ['id', 'nombreMedicamento', 'cantidad', 'demanda', 'esencial', 'mes', 'club', 'marca', 'precioUnidad']
        });
        console.log('Medicamentos Esenciales:', medicamentosEsenciales.map(med => med.dataValues));

        // Medicamentos básicos más solicitados
        const medicamentosBasicos = await InventarioActual.findAll({
            where: { esencial: false },
            order: [['demanda', 'DESC']],
            limit: 3,
            attributes: ['id', 'nombreMedicamento', 'cantidad', 'demanda', 'esencial', 'mes', 'club', 'marca', 'precioUnidad']
        });
        console.log('Medicamentos Básicos:', medicamentosBasicos.map(med => med.dataValues));

        // Lista de medicamentos donados
        const medicamentosDonados = await Medicamento.findAll({
            where: { idDonante },
            attributes: ['nombre', 'marca', 'tipo', 'precio']
        });
        console.log('Medicamentos Donados:', medicamentosDonados.map(med => med.dataValues));

        // Enfermedades crónicas de todos los pacientes
        const enfermedadesCronicas = await Paciente.findAll({
            attributes: ['enfermedadesCronicas']
        });
        console.log('Enfermedades Crónicas:', enfermedadesCronicas.map(pac => pac.dataValues));

        const chronicDiseases = enfermedadesCronicas
            .map(paciente => paciente.enfermedadesCronicas)
            .flat()
            .reduce((acc, enfermedad) => {
                if (!acc[enfermedad]) {
                    acc[enfermedad] = 0;
                }
                acc[enfermedad]++;
                return acc;
            }, {});
        console.log('Chronic Diseases:', chronicDiseases);

        // Distribución de pacientes por grupo de edad
        const pacientes = await Paciente.findAll({
            attributes: ['fechaNacimiento']
        });
        console.log('Pacientes:', pacientes.map(pac => pac.dataValues));

        const ageDistribution = pacientes.reduce((acc, paciente) => {
            const birthDate = new Date(paciente.fechaNacimiento);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            const ageRange = getAgeRange(age);
            if (!acc[ageRange]) {
                acc[ageRange] = 0;
            }
            acc[ageRange]++;
            return acc;
        }, {});
        console.log('Age Distribution:', ageDistribution);

        res.status(200).json({
            donante: donante.dataValues,
            ultimaEntrega: ultimaEntrega?.dataValues,
            totalDonaciones,
            pacientesAtendidos,
            medicamentosEsenciales: medicamentosEsenciales.map(med => med.dataValues),
            medicamentosBasicos: medicamentosBasicos.map(med => med.dataValues),
            medicamentosDonados: medicamentosDonados.map(med => med.dataValues),
            //chronicDiseases: Object.entries(chronicDiseases).map(([disease, count]) => ({ disease, count })),
            //ageDistribution: Object.entries(ageDistribution).map(([ageRange, count]) => ({ ageRange, count }))
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
};

const getAgeRange = (age: number) => {
    if (age <= 5) return '0-5';
    if (age <= 10) return '5-10';
    if (age <= 15) return '10-15';
    if (age <= 20) return '15-20';
    if (age <= 30) return '20-30';
    if (age <= 40) return '30-40';
    if (age <= 50) return '40-50';
    if (age <= 60) return '50-60';
    if (age <= 70) return '60-70';
    if (age <= 80) return '70-80';
    if (age <= 90) return '80-90';
    return '90+';
};
