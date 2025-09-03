import { DataTypes, Model, Optional } from 'sequelize'
import { ISede } from '../interfaces/Sede/ISede';
import sequelize from '../../config/database'
import { Colaborador } from './Colaborador';
import { TrabajadorSocial } from './TrabajadorSocial';

interface SedeCreationAttributes extends Optional<ISede, 'id'> { }

export class Sede extends Model<ISede, SedeCreationAttributes> implements ISede {
    public id?: string | undefined;
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
    public getColaboradores?: () => Promise<Colaborador[]>
    public getTrabajadoresSociales?: () => Promise<TrabajadorSocial[]>
}

Sede.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: new DataTypes.STRING(40),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('nombre', value ? value.trim() : undefined)
        }
    },
    nombre_url: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('nombre_url', value ? value.trim() : undefined)
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
    tableName: 'sede',
    modelName: 'Sede',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})