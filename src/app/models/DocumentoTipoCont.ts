import { DataTypes, Model, Optional } from 'sequelize';
import { IDocumentoTipoCont } from '../interfaces/DocumentoTipoCont/IDocumentoTipoCont';
import { TipoContingencia } from './TipoContingencia';
import sequelize from '../../config/database'
import HString from '../../helpers/HString';

interface DocumentoTipoContCreationAttributes extends Optional<IDocumentoTipoCont, 'id'> { }

export class DocumentoTipoCont extends Model<IDocumentoTipoCont, DocumentoTipoContCreationAttributes> implements IDocumentoTipoCont {
    public id?: string | undefined;
    public id_tipocontingencia?: string | undefined;
    public nombre?: string | undefined;
    public nombre_url?: string | undefined;
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
    public getTipoContingencia!: () => Promise<TipoContingencia>
}

DocumentoTipoCont.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_tipocontingencia: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: TipoContingencia,
            key: 'id'
        }
    },
    nombre: {
        type: new DataTypes.STRING(60),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre', value ? value.trim() : undefined)
        }
    },
    nombre_url: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_url', this.nombre ? HString.convertToUrlString(this.nombre.trim()) : undefined)
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
    tableName: 'documento_tipo_contingencia',
    modelName: 'DocumentoTipoCont',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})