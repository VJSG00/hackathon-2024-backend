import { Router } from 'express';
//import { AuthController } from '../controllers/Auth/newAuthController';
import { confirmToken, createGestor, login, setPassword } from '../controllers/Auth/AuthController';
import { body } from 'express-validator';
import { handleInputErrors } from '../middleware';

const newAuthRouter = Router();

// Ruta para crear gestor
newAuthRouter.post('/create-gestor',
    body('password')
        .isLength({ min: 8 }).withMessage('La contraseña es muy corta, minimo 8 caracteres'),
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors,
    createGestor);

//Ruta para verificar el jwt
newAuthRouter.get('/confirm/:token', confirmToken)

//Ruta para establecer la contraseña
newAuthRouter.post('/set-password',
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 caracteres'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Los Password no son iguales')
        }
        return true
    }),
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    handleInputErrors, setPassword)

//Ruta para login
newAuthRouter.post('/login',
    body('email')
        .isEmail().withMessage('E-mail no válido'),
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    login)

export default newAuthRouter;
