import { DataTypes, Model, Optional } from 'sequelize'
import { IReembolso } from '../interfaces/Reembolso/IReembolso';
import { EReembolso } from '../enums/EReembolso';
import { Canje } from './Canje';
import sequelize from '../../config/database'

interface ReembolsoCreationAttributes extends Optional<IReembolso, 'id'> { }

export class Reembolso extends Model<IReembolso, ReembolsoCreationAttributes> implements IReembolso {
    public id?: string | undefined;
    public id_canje?: string | undefined;
    public codigo?: string | undefined;
    public fecha_registro?: string | undefined;
    public fecha_maxima_reembolso?: string | undefined;
    public fecha_maxima_subsanar?: string | undefined;
    public is_cobrable?: boolean | undefined;
    public observacion?: string | undefined;
    public estado_registro?: EReembolso | undefined;
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
    public getCanje!: () => Promise<Canje>
}

Reembolso.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_canje: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Canje,
            key: 'id'
        }
    },
    codigo: {
        type: new DataTypes.STRING(12),
        allowNull: false
    },
    fecha_registro: {
        type: new DataTypes.STRING(10),
        allowNull: true
    },
    fecha_maxima_reembolso: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    fecha_maxima_subsanar: {
        type: new DataTypes.STRING(10),
        allowNull: true
    },
    is_cobrable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    observacion: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value: string) {
            this.setDataValue('observacion', value ? value.trim() : undefined)
        }
    },
    estado_registro: {
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
    tableName: 'reembolso',
    modelName: 'Reembolso',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})