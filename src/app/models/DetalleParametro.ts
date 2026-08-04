import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { IDetalleParametro } from '../interfaces/DetalleParametro/IDetalleParametro'
import { Parametro } from './Parametro'
import { DocumentoTipoCont } from './DocumentoTipoCont'

interface DetalleParametroCreatetionAttributes extends Optional<IDetalleParametro, 'id'> { }

export class DetalleParametro extends Model<IDetalleParametro, DetalleParametroCreatetionAttributes> implements IDetalleParametro {
    public id?: string | undefined
    public parametro_clase?: number | undefined
    public nombre?: string | undefined
    public nombre_url?: string | undefined
    public descripcion?: string | undefined
    public valor?: string | undefined
    public abreviatura?: string | undefined
    public longitud?: number | undefined
    public en_persona?: boolean | undefined
    public en_empresa?: boolean | undefined
    public compra?: boolean | undefined
    public venta?: boolean | undefined
    public visible?: boolean | undefined
    public user_crea?: string | undefined
    public user_actualiza?: string | undefined
    public user_elimina?: string | undefined
    public sistema?: boolean | undefined
    public estado?: boolean | undefined

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date

    // Asociaciones
    public getParametro!: () => Promise<Parametro>
    public getDocumentos?: () => Promise<DocumentoTipoCont[]>
}

DetalleParametro.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    parametro_clase: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: Parametro,
            key: 'clase'
        }
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
        type: DataTypes.STRING(100),
        allowNull: true,
        set(value: string) {
            this.setDataValue('descripcion', value ? value.trim() : undefined)
        }
    },
    valor: {
        type: DataTypes.STRING(20),
        allowNull: true,
        set(value: string) {
            this.setDataValue('valor', value ? value.trim() : undefined)
        }
    },
    abreviatura: {
        type: DataTypes.STRING(10),
        allowNull: true,
        set(value: string) {
            this.setDataValue('abreviatura', value ? value.trim() : undefined)
        }
    },
    longitud: {
        type: DataTypes.NUMBER,
        allowNull: true,
        set(value: number) {
            this.setDataValue('longitud', value ? value : undefined)
        }
    },
    en_persona: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    en_empresa: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    compra: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    venta: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    tableName: 'detalle_parametro',
    modelName: 'DetalleParametro',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})