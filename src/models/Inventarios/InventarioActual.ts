import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: "InventarioActual"
})
class InventarioActual extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    nombreMedicamento!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    cantidad!: number;

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
    mes!: string;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
    })
    club!: string[];

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    marca!: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    precioUnidad!: number;

}

export default InventarioActual;
