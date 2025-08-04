import { DataTypes, Model, Optional } from 'sequelize'
import { IEstablecimiento } from '../interfaces/Establecimiento/IEstablecimiento';
import { TipoEstablecimiento } from './TipoEstablecimiento';
import sequelize from '../../config/database'

// Define los atributos opcionales cuando se crea una instancia del modelo
interface EstablecimientoCreationAttributes extends Optional<IEstablecimiento, 'id'> { }

export class Establecimiento extends Model<IEstablecimiento, EstablecimientoCreationAttributes> implements IEstablecimiento {
    public id?: string | undefined;
    public id_tipoestablecimiento?: string | undefined;
    public ruc?: string | undefined;
    public nombre?: string | undefined;
    public direccion?: string | undefined;
    public telefono?: string | undefined;
    public nombre_tipoestablecimiento?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date

    // Asociaciones
    public getTipoEstablecimiento!: () => Promise<TipoEstablecimiento>

    // // Asociación con el modelo TipoEstablecimiento
    // public tipoEstablecimiento?: TipoEstablecimiento;

    // // Métodos de asociación
    // static associate(models: any) {
    //     Establecimiento.belongsTo(models.TipoEstablecimiento, {
    //         foreignKey: 'id_tipoestablecimiento',
    //         as: 'tipoestablecimiento',
    //         onDelete: 'SET NULL'
    //     });
    // }
}

// export default (sequelize: Sequelize) => {
Establecimiento.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_tipoestablecimiento: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: TipoEstablecimiento,
            key: 'id'
        }
    },
    ruc: {
        type: new DataTypes.STRING(13),
        allowNull: true
    },
    nombre: {
        type: new DataTypes.STRING(60),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('nombre', value ? value.trim() : undefined)
        }
    },
    direccion: {
        type: new DataTypes.STRING(60),
        allowNull: true,
        set(value: string) {
            this.setDataValue('direccion', value ? value.trim() : undefined)
        }
    },
    telefono: {
        type: new DataTypes.STRING(13),
        allowNull: true,
        set(value: string) {
            this.setDataValue('telefono', value ? value.trim() : undefined)
        }
    },
    nombre_tipoestablecimiento: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_tipoestablecimiento', value ? value.trim() : undefined)
        }
    },
    user_crea: {
        type: DataTypes.UUID,
        allowNull: true
    },
    user_actualiza: {
        type: DataTypes.UUID,
        allowNull: true
    },
    user_elimina: {
        type: DataTypes.UUID,
        allowNull: true
    },
    sistema: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'establecimiento',
    modelName: 'Establecimiento',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})

// return Establecimiento;
// };