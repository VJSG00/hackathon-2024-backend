// Import Express
import { Router } from 'express';
import { body } from 'express-validator';

//Controladores basicos
import { handleInputErrors } from '../middleware';
import { getPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente } from '../controllers/Paciente';
import { getMedicamentos, getMedicamentoById, createMedicamento, updateMedicamento, deleteMedicamento } from '../controllers/Medicamentos';
import { getDonantes, getDonanteById, createDonante, updateDonante, deleteDonante } from '../controllers/Donantes';
import { getEntregas, getEntregaById, updateEntrega, deleteEntrega } from '../controllers/Entregas';

//controladores avanzados
import { asignarMedicamentos } from '../controllers/Medicamentos';
import { createFullEntrega } from '../controllers/Entregas';
import { getInventarioActual, populateInventarioActual } from '../controllers/InventarioActual';
import { getInventarioMensual, populateInventarioMensual } from '../controllers/InventarioMensual';

// Seguridad para las rutas:
import { authenticate, verifyRole } from '../middleware/authMiddleware';

// Validaciones:
import { pacienteValidation, medicamentoValidation, donanteValidation, entregaValidation, createFullEntregaValidation, asignarMedicamentosValidation } from './Validaciones/Validaciones';
import { getDonanteInfo } from '../controllers/VistaRoles/VistaDonante';
import { getPacienteInfo } from '../controllers/VistaRoles/VistaPacientes';

const newRouter = Router();

// Aplicar middleware a todas las rutas
// newRouter.use(authenticate);
// newRouter.use(verifyRole('Gestor'));

// Rutas para Pacientes
newRouter.get('/pacientes', getPacientes);
newRouter.get('/pacientes/:id', getPacienteById);
    newRouter.post('/pacientes', pacienteValidation, handleInputErrors, createPaciente);
newRouter.put('/pacientes/:id', pacienteValidation, handleInputErrors, updatePaciente);
newRouter.delete('/pacientes/:id', deletePaciente);

// Rutas para Medicamentos
newRouter.get('/medicamentos', getMedicamentos);
newRouter.get('/medicamentos/:id', getMedicamentoById);
newRouter.post('/medicamentos', medicamentoValidation, handleInputErrors, createMedicamento);
newRouter.put('/medicamentos/:id', medicamentoValidation, handleInputErrors, updateMedicamento);
newRouter.delete('/medicamentos/:id', deleteMedicamento);

// Rutas para Donantes
newRouter.get('/donantes', getDonantes);
newRouter.get('/donantes/:id', getDonanteById);
newRouter.post('/donantes', donanteValidation, handleInputErrors, createDonante);
newRouter.put('/donantes/:id', donanteValidation, handleInputErrors, updateDonante);
newRouter.delete('/donantes/:id', deleteDonante);

// Rutas para Entregas
newRouter.get('/entregas', getEntregas);
newRouter.get('/entregas/:id', getEntregaById);
newRouter.put('/entregas/:id', entregaValidation, handleInputErrors, updateEntrega);
newRouter.delete('/entregas/:id', deleteEntrega);

// Login y registro


//Inventario:
// Rutas para Inventario Actual
newRouter.get('/inventario-actual', getInventarioActual);
newRouter.put('/populate-inventario-actual', populateInventarioActual);
// Rutas para Inventario Mensual
newRouter.get('/inventario-mensual', getInventarioMensual);
newRouter.put('/populate-inventario-mensual', populateInventarioMensual);

//Controladores Avanzados:
// Ruta para asignar medicamentos a un paciente
newRouter.put('/asignar-medicamentos', asignarMedicamentosValidation, handleInputErrors, asignarMedicamentos);

// Ruta para crear una entrega completa
newRouter.post('/create-full-entrega', createFullEntregaValidation, handleInputErrors,createFullEntrega);

// VISTAS PACIENTE Y DONANTE

//Donante
newRouter.get('/vista-donante/:idDonante', getDonanteInfo)
//Paciente
newRouter.get('/vista-paciente/:idPaciente', getPacienteInfo )

// Ruta para el Dashboard - TODO: separar en router - controlador.
//newRouter.get('/dashboard-data', getDashboardData);


export default newRouter;
