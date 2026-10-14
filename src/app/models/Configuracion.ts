import { DataTypes, Model, Optional } from "sequelize";
import { IConfiguracion } from "../interfaces/Configuracion/IConfiguracion";
import { ETipoDato } from "../enums/ETipoDato";
import sequelize from '../../config/database'

interface ConfiguracionCreationAttributes extends Optional<IConfiguracion, 'id'> { }

export class Configuracion extends Model<IConfiguracion, ConfiguracionCreationAttributes> implements IConfiguracion {
    public id?: string | undefined;
    public clave?: string | undefined;
    public valor?: string | undefined;
    public tipo_dato?: ETipoDato | undefined;
    public criterio?: string | undefined;
    public descripcion?: string | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;

    // Timestamps   
    public readonly created_at?: Date | undefined;
    public readonly updated_at?: Date | undefined;
    public readonly deleted_at?: Date | null | undefined;
}

Configuracion.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    clave: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    valor: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tipo_dato: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    criterio: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sistema: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    estado: {
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
    }
}, {
    tableName: 'configuracion',
    modelName: 'Configuracion',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})