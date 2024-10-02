import { Table, Column, Model, DataType, ForeignKey, BelongsToMany, BelongsTo } from 'sequelize-typescript';
import Paciente from './Paciente.model';
import Donante from './Donante.model';
import Medicamento from './Medicamento.model';
import EntregaMedicamentos from './EntregaMedicamentos.model';
import PacienteEntregas from './PacienteEntregas.model';

@Table({
    tableName: "Entregas"
})
class Entrega extends Model {
    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    fechaDonante!: Date;

    @ForeignKey(() => Donante)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idDonante!: number;

    @BelongsTo(() => Donante)
    donante!: Donante;

    @Column({
        type: DataType.ARRAY(DataType.INTEGER),
        allowNull: false
    })
    cantidadUnidades!: number[];

    @BelongsToMany(() => Medicamento, () => EntregaMedicamentos)
    medicamentos!: Medicamento[];

    @BelongsToMany(() => Paciente, () => PacienteEntregas)
    pacientes!: Paciente[];

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    motivo!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    comunidad!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    observaciones!: string;
}

export default Entrega;
