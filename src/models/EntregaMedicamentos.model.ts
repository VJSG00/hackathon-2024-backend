import { Table, Column, Model, ForeignKey, DataType } from 'sequelize-typescript';
import Entrega from './Entrega.model';
import Medicamento from './Medicamento.model';

@Table({
    tableName: "EntregaMedicamentos"
})
class EntregaMedicamentos extends Model {
    @ForeignKey(() => Entrega)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idEntrega!: number;

    @ForeignKey(() => Medicamento)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idMedicamento!: number;
}

export default EntregaMedicamentos;
