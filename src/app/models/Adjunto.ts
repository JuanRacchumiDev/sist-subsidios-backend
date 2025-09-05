import { IAdjunto } from "../interfaces/Adjunto/IAdjunto";
import { DataTypes, Model, Optional } from "sequelize";
import { TipoAdjunto } from "./TipoAdjunto";
import { DescansoMedico } from "./DescansoMedico";
import { Canje } from "./Canje";
import { Cobro } from "./Cobro";
import { Reembolso } from "./Reembolso";
import { Colaborador } from "./Colaborador";
import { TrabajadorSocial } from "./TrabajadorSocial";
import sequelize from '../../config/database'

interface AdjuntoCreationAttributes extends Optional<IAdjunto, 'id'> { }

export class Adjunto extends Model<IAdjunto, AdjuntoCreationAttributes> implements IAdjunto {
    public id?: string | undefined;
    public id_tipoadjunto?: string | undefined;
    public id_descansomedico?: string | undefined;
    public id_canje?: string | undefined;
    public id_cobro?: string | undefined;
    public id_reembolso?: string | undefined;
    public id_colaborador?: string | undefined;
    public id_trabajadorsocial?: string | undefined;
    public id_documento?: string | undefined;
    public file_name?: string | undefined;
    public file_type?: string | undefined;
    public file_data?: Buffer | undefined;
    public file_path?: string | undefined;
    public codigo_temp?: string | undefined;
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
    public getTipoAdjunto?: () => Promise<TipoAdjunto>
    public getDescansoMedico?: () => Promise<DescansoMedico>
    public getCanje?: () => Promise<Canje>
    public getCobro?: () => Promise<Cobro>
    public getReembolso?: () => Promise<Reembolso>
    public getColaborador?: () => Promise<Colaborador>
    public getTrabajadorSocial?: () => Promise<TrabajadorSocial>
}

Adjunto.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_tipoadjunto: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'TipoAdjunto',
            key: 'id'
        }
    },
    id_descansomedico: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'DescansoMedico',
            key: 'id'
        }
    },
    id_canje: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Canje',
            key: 'id'
        }
    },
    id_cobro: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Cobro',
            key: 'id'
        }
    },
    id_reembolso: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Reembolso',
            key: 'id'
        }
    },
    id_colaborador: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'Colaborador',
            key: 'id'
        }
    },
    id_trabajadorsocial: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'TrabajadorSocial',
            key: 'id'
        }
    },
    id_documento: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'DocumentoTipoCont',
            key: 'id'
        }
    },
    file_name: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('file_name', value ? value.trim() : undefined)
        }
    },
    file_type: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        set(value: string) {
            this.setDataValue('file_type', value ? value.trim() : undefined)
        }
    },
    file_data: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    file_path: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('file_path', value ? value.trim() : undefined)
        }
    },
    codigo_temp: {
        type: new DataTypes.STRING(10),
        allowNull: true
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
    tableName: 'adjunto',
    modelName: 'Adjunto',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})