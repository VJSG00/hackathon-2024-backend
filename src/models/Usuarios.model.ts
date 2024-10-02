import { Table, Column, Model, DataType, BeforeSave, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Paciente from './Paciente.model';
import Donante from './Donante.model';

@Table({
    tableName: 'Users',
})
class Usuarios extends Model {

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    role!: string;

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false,
        allowNull: false
    })
    confirmed!: boolean;

    @ForeignKey(() => Paciente)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    idPaciente!: number | null;

    @BelongsTo(() => Paciente)
    paciente!: Paciente;

    @ForeignKey(() => Donante)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    idDonante!: number | null;

    @BelongsTo(() => Donante)
    donante!: Donante;

    @BeforeSave
    static async lowerCaseEmail(user: Usuarios) {
        if (user.email) {
            user.email = user.email.toLowerCase();
        }
    }
}

export default Usuarios;
