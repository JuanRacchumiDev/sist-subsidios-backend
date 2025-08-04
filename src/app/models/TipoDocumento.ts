import { DataTypes, Model, Optional } from 'sequelize'
import { ITipoDocumento } from '../interfaces/TipoDocumento/ITipoDocumento';
import sequelize from '../../config/database'
import { Persona } from './Persona';
import { Colaborador } from './Colaborador';

// Define los atributos opcionales cuando se crea una instancia del modelo
interface TipoDocumentoCreationAttributes extends Optional<ITipoDocumento, 'id'> { }

export class TipoDocumento extends Model<ITipoDocumento, TipoDocumentoCreationAttributes> implements ITipoDocumento {
    public id?: string | undefined;
    public nombre?: string | undefined;
    public nombre_url?: string | undefined;
    public abreviatura?: string | undefined;
    public longitud?: number | undefined;
    public en_persona?: boolean | undefined;
    public en_empresa?: boolean | undefined;
    public compra?: boolean | undefined;
    public venta?: boolean | undefined;
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
    public getPersonas!: () => Promise<Persona[]>
    public getColaboradores!: () => Promise<Colaborador[]>

    // Métodos de asociación
    // static associate(models: any) {
    //     TipoDocumento.hasMany(models.Persona, {
    //         foreignKey: 'id_tipodocumento',
    //         as: 'personas',
    //         onDelete: 'SET NULL'
    //     });

    //     TipoDocumento.hasMany(models.Colaborador, {
    //         foreignKey: 'id_tipodocumento',
    //         as: 'colaboradores',
    //         onDelete: 'SET NULL'
    //     });
    // }
}

// export default (sequelize: Sequelize) => {
TipoDocumento.init({
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
    abreviatura: {
        type: new DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('abreviatura', value ? value.trim() : undefined)
        }
    },
    longitud: {
        type: DataTypes.NUMBER,
        allowNull: false
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
    tableName: 'tipo_documento',
    modelName: 'TipoDocumento',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})

// return TipoDocumento;
// };