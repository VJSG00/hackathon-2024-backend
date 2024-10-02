import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: "Donantes"
})
class Donante extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    nombre!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    telefono!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    correo!: string;

    @Column({
        type: DataType.ENUM('unica', 'periodica', 'recurrente'),
        allowNull: false
    })
    frecuencia!: string;

    @Column({
        type: DataType.ENUM('particular', 'ong', 'privada', 'publico'),
        allowNull: false
    })
    tipo!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    observaciones?: string;
}

export default Donante;
