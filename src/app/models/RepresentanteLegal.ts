import { ICargo } from "../interfaces/Cargo/ICargo";
import { IEmpresa } from "../interfaces/Empresa/IEmpresa";
import { IRepresentanteLegal } from "../interfaces/RepresentanteLegal/IRepresentanteLegal";
import { ITipoDocumento } from "../interfaces/TipoDocumento/ITipoDocumento";
import { Optional, DataTypes, Model } from 'sequelize';
import { TipoDocumento } from "./TipoDocumento";
import { Empresa } from "./Empresa";
import { Cargo } from "./Cargo";
import sequelize from '../../config/database'

interface RepresentanteLegalCreationAttributes extends Optional<IRepresentanteLegal, 'id'> { }

export class RepresentanteLegal extends Model<IRepresentanteLegal, RepresentanteLegalCreationAttributes> implements IRepresentanteLegal {
    public id?: string | undefined;
    public id_tipodocumento?: string | undefined;
    public id_empresa?: string | undefined;
    public id_cargo?: string | undefined;
    public numero_documento?: string | undefined;
    public nombres?: string | undefined;
    public apellido_paterno?: string | undefined;
    public apellido_materno?: string | undefined;
    public direccion_fiscal?: string | undefined;
    public partida_registral?: string | undefined;
    public telefono?: string | undefined;
    public correo?: string | undefined;
    public ospe?: string | undefined;
    public user_crea?: string
    public user_actualiza?: string
    public user_elimina?: string
    public sistema?: boolean
    public estado?: boolean
    public tipoDocumento?: ITipoDocumento | undefined;
    public empresa?: IEmpresa | undefined;
    public cargo?: ICargo | undefined;

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date

    // Asociaciones
    public getTipoDocumento!: () => Promise<TipoDocumento>
    public getEmpresa!: () => Promise<Empresa>
    public getCargo!: () => Promise<Cargo>
}

RepresentanteLegal.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_tipodocumento: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: TipoDocumento,
            key: 'id'
        }
    },
    id_empresa: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Empresa,
            key: 'id'
        }
    },
    id_cargo: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Cargo,
            key: 'id'
        }
    },
    numero_documento: {
        type: new DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('numero_documento', value ? value.trim() : undefined)
        }
    },
    nombres: {
        type: new DataTypes.STRING(40),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombres', value ? value.trim() : undefined)
        }
    },
    apellido_paterno: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        set(value: string) {
            this.setDataValue('apellido_paterno', value ? value.trim() : undefined)
        }
    },
    apellido_materno: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        set(value: string) {
            this.setDataValue('apellido_materno', value ? value.trim() : undefined)
        }
    },
    direccion_fiscal: {
        type: new DataTypes.STRING(60),
        allowNull: false,
        set(value: string) {
            this.setDataValue('direccion_fiscal', value ? value.trim() : undefined)
        }
    },
    partida_registral: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        set(value: string) {
            this.setDataValue('partida_registral', value ? value.trim() : undefined)
        }
    },
    telefono: {
        type: new DataTypes.STRING(13),
        allowNull: false,
        set(value: string) {
            this.setDataValue('telefono', value ? value.trim() : undefined)
        }
    },
    correo: {
        type: new DataTypes.STRING(60),
        allowNull: false,
        set(value: string) {
            this.setDataValue('correo', value ? value.trim() : undefined)
        }
    },
    ospe: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        set(value: string) {
            this.setDataValue('ospe', value ? value.trim() : undefined)
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
    tableName: 'representante_legal',
    modelName: 'RepresentanteLegal',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
});