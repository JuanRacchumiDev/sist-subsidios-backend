import { ITipoAdjunto } from "../interfaces/TipoAdjunto/ITipoAdjunto";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from '../../config/database'

interface TipoAdjuntoCreationAttributes extends Optional<ITipoAdjunto, 'id'> { }

export class TipoAdjunto extends Model<ITipoAdjunto, TipoAdjuntoCreationAttributes> implements ITipoAdjunto {
    public id?: string | undefined;
    public nombre?: string | undefined;
    public extensiones?: string | undefined;
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

TipoAdjunto.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: new DataTypes.STRING(60),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('nombre', value ? value.trim() : undefined)
        }
    },
    extensiones: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('extensiones', value ? value.trim() : undefined)
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
    tableName: 'tipo_adjunto',
    modelName: 'TipoAdjunto',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})