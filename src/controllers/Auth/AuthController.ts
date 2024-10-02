import { Request, Response } from 'express';
import Usuarios from '../../models/Usuarios.model';
import { hashPassword } from '../../utils/auth';
import { checkPassword } from '../../utils/auth';
import { generateJWT } from '../../utils/jwt';
import { AuthEmail } from '../../emails/AuthEmail';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Paciente from '../../models/Paciente.model';
import Donante from '../../models/Donante.model';

export const createGestor = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body;
        const role: 'Gestor' = 'Gestor';
        const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        await Usuarios.create({ email: email.toLowerCase(), password:'', role });
        await AuthEmail.sendConfirmationEmail({ email, name, token });

        res.status(201).json({ message: 'Gestor creado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



export const confirmToken = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { email: string, role: string };
        const user = await Usuarios.findOne({ where: { email: decoded.email } });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar la propiedad confirmed a true
        await Usuarios.update({ confirmed: true }, { where: { email: decoded.email } });

        res.status(200).json({ message: 'Token válido y usuario confirmado', email: decoded.email, role: decoded.role });
    } catch (error) {
        res.status(400).json({ error: 'Token inválido o expirado' });
    }
};



// Establecer contraseña de una cuenta confirmada.
export const setPassword = async (req: Request, res: Response) => {
    const { email, password, confirmPassword } = req.body;

    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Las contraseñas no coinciden' });
    }

    try {
        const user = await Usuarios.findOne({ where: { email } });
        const data = user.dataValues
        // Verificar que la cuenta esté confirmada
        if (!data || !data.confirmed) {
            return res.status(400).json({ error: 'La cuenta no está confirmada' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await Usuarios.update({ password: hashedPassword }, { where: { email } });

        res.status(200).json({ message: 'Contraseña establecida correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await Usuarios.findOne({ where: { email }, include: [Paciente, Donante] });
        const data = user?.dataValues;

        // Verificar que el usuario exista y la cuenta esté confirmada
        if (!data || !data.confirmed) {
            return res.status(400).json({ error: 'La cuenta no está confirmada o el usuario no existe' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar el token JWT incluyendo el rol del usuario y las nuevas propiedades
        const token = jwt.sign(
            { id: data.id, role: data.role, email: data.email, idPaciente: data.idPaciente, idDonante: data.idDonante },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ error: error});
    }
};

// export class AuthController {

//     static login = async (req: Request, res: Response) => {
//         try {
//             const { email, password } = req.body;
//             const user = await Usuarios.findOne({ where: { email } });
//             if (!user) {
//                 return res.status(404).json({ error: 'Usuario no encontrado' });
//             }

//             const isPasswordCorrect = await checkPassword(password, user.password);
//             if (!isPasswordCorrect) {
//                 return res.status(401).json({ error: 'Password Incorrecto' });
//             }

//             const token = generateJWT({ id: user.id, role: user.role });
//             res.send({ token });
//         } catch (error) {
//             res.status(500).json({ error: 'Hubo un error' });
//         }
//     }
// }


