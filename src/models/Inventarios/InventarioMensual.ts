import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import InventarioActual from './InventarioActual';

@Table({
    tableName: "InventarioMensual"
})
class InventarioMensual extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    nombreMedicamento!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    recibidas!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    demanda!: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    esencial!: boolean;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    marca!: string;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
    })
    club!: string[];
}

export default InventarioMensual;
