import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { IUsuario } from "../interfaces/Usuario/IUsuario";
import { DetalleParametro } from './DetalleParametro'
import { IDetalleParametro } from "../interfaces/DetalleParametro/IDetalleParametro"
import { Persona } from './Persona';
import { IPersona } from '../interfaces/Persona/IPersona';

interface UsuarioCreationAttributes extends Optional<IUsuario, 'id'> { }

export class Usuario extends Model<IUsuario, UsuarioCreationAttributes> implements IUsuario {
    public id?: string | undefined;
    public id_perfil?: string | undefined;
    public id_persona?: string | undefined;
    public username?: string | undefined;
    public email?: string | undefined;
    public password?: string | undefined;
    public nombre_persona?: string | undefined;
    public remember_token?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;
    public perfil?: IDetalleParametro | undefined;
    public persona?: IPersona | undefined;

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date

    // Asociaciones
    public getPerfil?: () => Promise<DetalleParametro>
    public getPersona?: () => Promise<Persona>
}

Usuario.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_perfil: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: DetalleParametro,
            key: "id"
        }
    },
    id_persona: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Persona,
            key: 'id'
        }
    },
    username: {
        type: DataTypes.STRING(12),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    nombre_persona: {
        type: DataTypes.STRING(80),
        allowNull: true
    },
    remember_token: {
        type: DataTypes.STRING(10),
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
    tableName: 'usuario',
    modelName: 'Usuario',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
});