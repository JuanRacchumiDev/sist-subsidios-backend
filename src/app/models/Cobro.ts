import { DataTypes, Model, Optional } from 'sequelize'
import { ICobro } from '../interfaces/Cobro/ICobro';
import { ECobro } from '../enums/ECobro';
import { Reembolso } from './Reembolso';
import sequelize from '../../config/database'

interface CobroCreationAttributes extends Optional<ICobro, 'id'> { }

export class Cobro extends Model<ICobro, CobroCreationAttributes> implements ICobro {
    public id?: string | undefined;
    public id_reembolso?: string | undefined;
    public codigo?: string | undefined;
    public codigo_cheque?: string | undefined;
    public codigo_voucher?: string | undefined;
    public fecha_registro?: string | undefined;
    public fecha_maxima_cobro?: string | undefined;
    public observacion?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public estado_registro?: ECobro | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date

    // Asociación con el modelo Reembolso
    // public reembolso?: Reembolso;
    public getReembolso!: () => Promise<Reembolso>

    // Métodos de asociación
    // static associate(models: any) {
    //     Cobro.belongsTo(models.Reembolso, {
    //         foreignKey: 'id_reembolso',
    //         as: 'reembolso',
    //         onDelete: 'SET NULL'
    //     });
    // }
}

// export default (sequelize: Sequelize) => {
Cobro.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_reembolso: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Reembolso,
            key: 'id'
        }
    },
    codigo: {
        type: new DataTypes.STRING(30),
        allowNull: false
    },
    codigo_cheque: {
        type: new DataTypes.STRING(15),
        allowNull: true,
        set(value: string) {
            this.setDataValue('codigo_cheque', value ? value.trim() : undefined)
        }
    },
    codigo_voucher: {
        type: new DataTypes.STRING(15),
        allowNull: true,
        set(value: string) {
            this.setDataValue('codigo_voucher', value ? value.trim() : undefined)
        }
    },
    fecha_registro: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    fecha_maxima_cobro: {
        type: new DataTypes.STRING(10),
        allowNull: false
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
    tableName: 'cobro',
    modelName: 'Cobro',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})

// return Cobro;
// }