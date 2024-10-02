import {body} from 'express-validator'

// Validaciones para los datos del paciente
const pacienteValidation = [
    body('nombreCompleto').notEmpty().isString().withMessage('El nombre completo debe ser una cadena de texto'),
    body('fechaNacimiento').notEmpty().isISO8601().withMessage('La fecha de nacimiento debe ser una fecha válida'),
    body('genero').notEmpty().isString().withMessage('El género debe ser una cadena de texto'),
    body('direccion').optional().isString().withMessage('La dirección debe ser una cadena de texto'),
    body('telefono').optional().isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('correo').notEmpty().isEmail().withMessage('El correo debe ser un correo válido'),
    body('identificador').notEmpty().isIn(['cedula', 'p.nacimiento']).withMessage('El identificador debe ser "cedula" o "p. nacimiento"'),
    body('cedula').optional().isString().withMessage('La cédula debe ser una cadena de texto'),
    body('partidaNacimiento').optional().isString().withMessage('La partida de nacimiento debe ser una cadena de texto'),
    body('antecedentes').optional().isArray().withMessage('Los antecedentes deben ser un array de cadenas de texto'),
    body('enfermedadesCronicas').optional().isArray().withMessage('Las enfermedades crónicas deben ser un array de cadenas de texto'),
    body('medicamentosBasicos').optional().isArray().withMessage('Los medicamentos básicos deben ser un array de cadenas de texto'),
    body('medicamentosEsenciales').optional().isArray().withMessage('Los medicamentos esenciales deben ser un array de cadenas de texto'),
    body('prioridad').notEmpty().isBoolean().withMessage('La prioridad debe ser un valor booleano'),
    body('periodoTratamiento').optional().isISO8601().withMessage('El periodo de tratamiento debe ser una fecha válida')
];



// Validaciones para los datos de medicamentos
const medicamentoValidation = [
    body('nombre').notEmpty().isString().withMessage('El nombre debe ser una cadena de texto'),
    body('esencial').notEmpty().isBoolean().withMessage('El valor esencial debe ser booleano'),
    body('insumo').notEmpty().isBoolean().withMessage('El valor insumo debe ser booleano'),
    body('fechaPaciente').notEmpty().isISO8601().withMessage('La fecha del paciente debe ser una fecha válida'),
    body('fechaVencimiento').notEmpty().isISO8601().withMessage('La fecha de vencimiento debe ser una fecha válida'),
    body('tipo').optional().isArray().withMessage('El tipo debe ser un array de cadenas de texto'),
    body('devuelto').optional().isBoolean().withMessage('El valor devuelto debe ser booleano'),
    body('presentacion').notEmpty().isString().withMessage('La presentación debe ser una cadena de texto'),
    body('fechaDonante').optional().isISO8601().withMessage('La fecha del donante debe ser una fecha válida'),
    body('observaciones').optional().isString().withMessage('Las observaciones deben ser una cadena de texto'),
    body('marca').optional().isString().withMessage('La marca debe ser una cadena de texto'),
    body('precio').optional().isFloat().withMessage('El precio debe ser un número válido')
];




// Validaciones para los datos de donantes
const donanteValidation = [
    body('nombre').notEmpty().isString().withMessage('El nombre debe ser una cadena de texto'),
    body('telefono').optional().isString().withMessage('El teléfono debe ser una cadena de texto'),
    body('correo').notEmpty().isEmail().withMessage('El correo debe ser un correo válido'),
    body('frecuencia').notEmpty().isIn(['unica', 'periodica', 'recurrente']).withMessage('La frecuencia debe ser "unica", "periodica" o "recurrente"'),
    body('tipo').notEmpty().isIn(['particular', 'ong', 'privada', 'publico']).withMessage('El tipo debe ser "particular", "ong", "privada" o "publico"')
];



// Validaciones para los datos de entregas
const entregaValidation = [
    body('fechaEntrega').notEmpty().isISO8601().withMessage('La fecha de entrega debe ser una fecha válida'),
    body('idPaciente').notEmpty().isInt().withMessage('El ID del paciente debe ser un número entero'),
    body('idDonante').notEmpty().isInt().withMessage('El ID del donante debe ser un número entero'),
    body('cantidadUnidades').notEmpty().isArray({ min: 1 }).withMessage('La cantidad de unidades debe ser un array de números enteros'),
    body('idMedicamento').notEmpty().isInt().withMessage('El ID del medicamento debe ser un número entero')
];

// Validaciones para Crear Full Entrega:
const createFullEntregaValidation = [
    body('donanteData.nombre').notEmpty().isString().withMessage('El nombre del donante debe ser una cadena de texto'),
    body('donanteData.correo').notEmpty().isEmail().withMessage('El correo del donante debe ser un correo válido'),
    body('medicamentosData').isArray({ min: 1 }).withMessage('Debe haber al menos un medicamento'),
    body('medicamentosData.*.nombre').notEmpty().isString().withMessage('El nombre del medicamento debe ser una cadena de texto'),
    body('medicamentosData.*.esencial').notEmpty().isBoolean().withMessage('El valor esencial debe ser booleano'),
    body('medicamentosData.*.insumo').notEmpty().isBoolean().withMessage('El valor insumo debe ser booleano'),
    body('medicamentosData.*.fechaVencimiento').notEmpty().isISO8601().withMessage('La fecha de vencimiento debe ser una fecha válida'),
    body('medicamentosData.*.tipo').optional().isArray().withMessage('El tipo debe ser un array de cadenas de texto'),
    body('medicamentosData.*.devuelto').optional().isBoolean().withMessage('El valor devuelto debe ser booleano'),
    body('medicamentosData.*.presentacion').notEmpty().isString().withMessage('La presentación debe ser una cadena de texto'),
    body('medicamentosData.*.fechaDonante').optional().isISO8601().withMessage('La fecha del donante debe ser una fecha válida'),
    body('medicamentosData.*.observaciones').optional().isString().withMessage('Las observaciones deben ser una cadena de texto'),
    body('medicamentosData.*.marca').optional().isString().withMessage('La marca debe ser una cadena de texto'),
    body('medicamentosData.*.precio').optional().isFloat().withMessage('El precio debe ser un número válido'),
    body('cantidadUnidades').isArray({ min: 1 }).withMessage('La cantidad de unidades debe ser un array de números enteros')
];

//Validaciones para Asignar Medicamentos:
const asignarMedicamentosValidation = [
    body('identificador').notEmpty().isString().withMessage('El identificador debe ser una cadena de texto'),
    body('valorIdentificador').notEmpty().isString().withMessage('El valor del identificador debe ser una cadena de texto'),
    body('nombreMedicamento').notEmpty().isString().withMessage('El nombre del medicamento debe ser una cadena de texto'),
    body('cantidad').notEmpty().isInt({ min: 1 }).withMessage('La cantidad debe ser un número entero mayor que cero'),
    body('fechaPaciente').notEmpty().isISO8601().withMessage('La fecha del paciente debe ser una fecha válida')
];



export {pacienteValidation, medicamentoValidation,donanteValidation, entregaValidation, createFullEntregaValidation, asignarMedicamentosValidation }