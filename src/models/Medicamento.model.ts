import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BeforeSave } from 'sequelize-typescript';
import Donante from './Donante.model';
import Paciente from './Paciente.model';

@Table({
    tableName: "Medicamentos"
})
class Medicamento extends Model {
    @ForeignKey(() => Donante)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    idDonante!: number;

    @BelongsTo(() => Donante)
    donante!: Donante;

    @ForeignKey(() => Paciente)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    idPaciente!: number;

    @BelongsTo(() => Paciente)
    paciente!: Paciente;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    nombre!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    esencial!: boolean;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    insumo!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    fechaPaciente!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    fechaVencimiento!: Date;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
    })
    tipo!: string[];

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })
    devuelto!: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    presentacion!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    fechaDonante!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    observaciones!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    marca!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: true,
    })
    precio!: number;
}

export default Medicamento;
