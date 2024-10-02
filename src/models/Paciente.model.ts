import { Table, Column, Model, DataType, BelongsToMany } from 'sequelize-typescript';
import Entrega from './Entrega.model';
import PacienteEntregas from './PacienteEntregas.model';

@Table({
    tableName: "Pacientes"
})
class Paciente extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    nombreCompleto!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    fechaNacimiento!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    direccion!: string;

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
        type: DataType.ENUM('cedula', 'p.nacimiento'),
        allowNull: false
    })
    identificador!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    cedula?: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    partidaNacimiento?: string;

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false
    })
    antecedentes!: string[];

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: false
    })
    enfermedadesCronicas!: string[];

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true
    })
    medicamentosBasicos!: string[];

    @Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true
    })
    medicamentosEsenciales!: string[];

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false
        
    })
    prioridad!: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    periodoTratamiento!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    observaciones!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    comunidad!: string;

    @Column({
        type: DataType.ENUM('Urbana', 'Rural', 'Suburbana'),
        allowNull: true
    })
    tipoComunidad!: string;

    @Column({
        type: DataType.ENUM('Propia', 'Alquiler', 'ViviendaSocial', 'Precaria'),
        allowNull: true
    })
    tipoVivienda!: string;

    @Column({
        type: DataType.ENUM('Femenino', 'Masculino'),
        allowNull: false
    })
    genero!: string;

    @Column({
        type: DataType.ENUM('Activo', 'No Activo', 'Fallecido'),
        allowNull: false,
        defaultValue: 'Activo'
    })
    status!: string;

    @BelongsToMany(() => Entrega, () => PacienteEntregas)
    entregas!: Entrega[];
}

export default Paciente;
