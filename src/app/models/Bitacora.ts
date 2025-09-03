import { DataTypes, Model, Optional } from 'sequelize'
import { IBitacora } from '../interfaces/Bitacora/IBitacora';
import { EAccion } from '../enums/EAccion';
import sequelize from '../../config/database'

interface BitacoraCreationAttributes extends Optional<IBitacora, 'id'> { }

export class Bitacora extends Model<IBitacora, BitacoraCreationAttributes> implements IBitacora {
    public id?: string | undefined;
    public tabla?: string | undefined;
    public valor_anterior?: string | undefined;
    public valor_nuevo?: string | undefined;
    public accion?: EAccion | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public nombre_user?: string | undefined;

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date
}

Bitacora.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    tabla: {
        type: new DataTypes.STRING(30),
        allowNull: false,
        set(value: string) {
            this.setDataValue('tabla', value ? value.trim() : undefined)
        }
    },
    valor_anterior: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('valor_anterior', value ? value.trim() : undefined)
        }
    },
    valor_nuevo: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('valor_nuevo', value ? value.trim() : undefined)
        }
    },
    accion: {
        type: new DataTypes.STRING(30),
        allowNull: false
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
    nombre_user: {
        type: new DataTypes.STRING(10),
        allowNull: false
    }
}, {
    tableName: 'bitacora',
    modelName: 'Bitacora',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})