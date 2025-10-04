import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../../config/database'
import { IUsuario } from "../interfaces/Usuario/IUsuario";
import { Colaborador } from './Colaborador';
import { TrabajadorSocial } from './TrabajadorSocial';
import { Perfil } from './Perfil';
import { IPerfil } from '../interfaces/Perfil/IPerfil';
import { IColaborador } from '../interfaces/Colaborador/IColaborador';
import { ITrabajadorSocial } from '../interfaces/TrabajadorSocial/ITrabajadorSocial';
import { Persona } from './Persona';

interface UsuarioCreationAttributes extends Optional<IUsuario, 'id'> { }

export class Usuario extends Model<IUsuario, UsuarioCreationAttributes> implements IUsuario {
    public id?: string | undefined;
    public id_perfil?: string | undefined;
    public id_persona?: string | undefined;
    public id_colaborador?: string | undefined;
    public id_trabajadorsocial?: string | undefined;
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
    public perfil?: IPerfil | undefined;
    public colaborador?: IColaborador | undefined;
    public trabajadorSocial?: ITrabajadorSocial | undefined;

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date

    // Asociaciones
    public getPerfil?: () => Promise<Perfil>
    public getPersona?: () => Promise<Persona>
    public getColaborador?: () => Promise<Colaborador>
    public getTrabajadorSocial?: () => Promise<TrabajadorSocial>
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
            model: Perfil,
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
    id_colaborador: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Colaborador,
            key: 'id'
        }
    },
    id_trabajadorsocial: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: TrabajadorSocial,
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