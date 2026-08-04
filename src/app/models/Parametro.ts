import { IParametro } from "../interfaces/Parametro/IParametro";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from '../../config/database'

interface ParametroCreationAttributes extends Optional<IParametro, 'clase'> { }

export class Parametro extends Model<IParametro, ParametroCreationAttributes> implements IParametro {
    public clase?: number | undefined;
    public nombre?: string | undefined;
    public nombre_url?: string | undefined;
    public descripcion?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date
}

Parametro.init({
    clase: {
        type: DataTypes.INTEGER,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre', value ? value.trim() : undefined)
        }
    },
    nombre_url: {
        type: DataTypes.STRING(120),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_url', value ? value.trim() : undefined)
        }
    },
    descripcion: {
        type: DataTypes.STRING(120),
        allowNull: true,
        set(value: string) {
            this.setDataValue('descripcion', value ? value.trim() : undefined)
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
    tableName: 'parametro',
    modelName: 'Parametro',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})