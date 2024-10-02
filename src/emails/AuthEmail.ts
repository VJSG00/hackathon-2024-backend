import { transporter } from "../config/nodemailer";

interface IEmail {
    email: string;
    name: string;
    token: string;
}

interface asignEmail {
    email: string;
    name: string;
    cantidad: number;
    fechaPaciente: string;
    nombreMedicamento: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: IEmail) => {
        const info = await transporter.sendMail({
            from: 'Santos Luzardo <admin@SantosLuzardo.com>',
            to: user.email,
            subject: 'Santos Luzardo te invita a Registrarte',
            text: 'Santos Luzardo - Registra tu cuenta',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <div style="background-color: #005d90; padding: 10px; text-align: center; color: white;">
                        <h1>Santos Luzardo</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hola: ${user.name},</p>
                        <p>Has creado tu cuenta en Santos Luzardo, ya casi está todo listo, solo debes confirmar tu cuenta.</p>
                        <p>Visita el siguiente enlace:</p>
                        <a href="${process.env.FRONTEND_URL}/auth/confirm-account/${user.token}" style="color: #35a1da;">Confirmar cuenta</a>
                        <p>Este token expira en 24 horas.</p>
                    </div>
                    <div style="background-color: #f1f1f1; padding: 10px; text-align: center;">
                        <p>© 2024 Santos Luzardo</p>
                    </div>
                </div>
            `
        });

        console.log('Mensaje enviado', info.messageId);
    }

    static EmailAsignación = async (user: asignEmail) => {
        const info = await transporter.sendMail({
            from: 'Santos Luzardo <admin@SantosLuzardo.com>',
            to: user.email,
            subject: 'Asignación de Medicamentos',
            text: `Hola ${user.name}, se te han asignado ${user.cantidad} unidades de ${user.nombreMedicamento}. Debes retirarlos el ${user.fechaPaciente}.`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <div style="background-color: #005d90; padding: 10px; text-align: center; color: white;">
                        <h1>Santos Luzardo</h1>
                    </div>
                    <div style="padding: 20px;">
                        <p>Hola ${user.name},</p>
                        <p>Se te han asignado <strong>${user.cantidad}</strong> unidades de <strong>${user.nombreMedicamento}</strong>.</p>
                        <p>Debes retirarlos el <strong>${user.fechaPaciente}</strong>.</p>
                    </div>
                    <div style="background-color: #f1f1f1; padding: 10px; text-align: center;">
                        <p>© 2024 Santos Luzardo</p>
                    </div>
                </div>
            `
        });

        console.log('Mensaje enviado', info.messageId);
    }
}
