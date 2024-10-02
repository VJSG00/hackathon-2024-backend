import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import Paciente from './Paciente.model';
import Entrega from './Entrega.model';

@Table({
    tableName: "PacienteEntregas"
})
class PacienteEntregas extends Model {
    @ForeignKey(() => Paciente)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idPaciente!: number;

    @ForeignKey(() => Entrega)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idEntrega!: number;
}

export default PacienteEntregas;
