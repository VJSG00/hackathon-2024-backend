import jwt from 'jsonwebtoken';

interface UserPayload {
    id: number;
    role: string;
}

export const generateJWT = (payload: UserPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};
