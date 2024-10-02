import jwt, { decode } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Usuarios from '../models/Usuarios.model';


declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            id: string;
            email: string;
            role: string;
            confirmed: boolean;
        };
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        return res.status(401).json({ error: 'No Autorizado' });
    }

    const [, token] = bearer.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
        console.log(decoded)
        if (typeof decoded === 'object' && decoded.id) {
            const user = await Usuarios.findByPk(decoded.id, { attributes: ['id', 'role', 'email', 'confirmed'] });
            const data = user.dataValues
            //console.log(user)
            if (data) {
                if (!data.confirmed) {
                    return res.status(401).json({ error: 'Cuenta no confirmada' });
                }
                req.user = user.get({ plain: true }); // Asegurarse de obtener un objeto plano
                next();           
                } else {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } else {
            return res.status(401).json({ error: 'Token no válido' });
        }
    } catch (error) {
        return res.status(401).json({ error: 'Token no válido' });
    }
};


export const verifyRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(req.user.role)
        if (req.user.role !== role) {
            return res.status(403).json({ error: 'No está autorizado...' });
        }
        next();
    };
};
