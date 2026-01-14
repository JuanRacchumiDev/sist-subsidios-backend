import { IGrupoPersona } from "../interfaces/GrupoPersona/IGrupoPersona";
import { DataTypes, Model, Optional } from "sequelize";
import { Persona } from "./Persona";
import { DetalleParametro } from "./DetalleParametro";
import sequelize from '../../config/database'

interface GrupoPersonaCreationAttributes extends Optional<IGrupoPersona, 'id'> { }

export class GrupoPersona extends Model<IGrupoPersona, GrupoPersonaCreationAttributes> implements IGrupoPersona {
    public id?: string | undefined;
    public id_persona?: string | undefined;
    public id_grupo?: string | undefined;
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
    public getPersona!: () => Promise<Persona>
    public getGrupo!: () => Promise<DetalleParametro>
}

GrupoPersona.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_persona: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Persona,
            key: 'id'
        }
    },
    id_grupo: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: DetalleParametro,
            key: 'id'
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
    tableName: 'grupo_persona',
    modelName: 'GrupoPersona',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})