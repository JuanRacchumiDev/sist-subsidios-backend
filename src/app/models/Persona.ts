import { DataTypes, Model, Optional } from 'sequelize'
import { IPersona } from '../interfaces/Persona/IPersona';
import { EOrigen } from '../enums/EOrigen';
import { TipoDocumento } from './TipoDocumento';
import sequelize from '../../config/database'

// Define los atributos opcionales cuando se crea una instancia del modelo
interface PersonaCreationAttributes extends Optional<IPersona, 'id'> { }

export class Persona extends Model<IPersona, PersonaCreationAttributes> implements IPersona {
    public id?: string | undefined;
    public id_tipodocumento?: string | undefined;
    public numero_documento?: string | undefined;
    public nombres?: string | undefined;
    public apellido_paterno?: string | undefined;
    public apellido_materno?: string | undefined;
    public nombre_completo?: string | undefined;
    public departamento?: string | undefined;
    public provincia?: string | undefined;
    public distrito?: string | undefined;
    public direccion?: string | undefined;
    public direccion_completa?: string | undefined;
    public ubigeo_reniec?: string | undefined;
    public ubigeo_sunat?: string | undefined;
    public ubigeo?: string | undefined;
    public fecha_nacimiento?: string | undefined;
    public estado_civil?: string | undefined;
    public foto?: string | undefined;
    public sexo?: string | undefined;
    public origen?: EOrigen | undefined;
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
    public getTipoDocumento!: () => Promise<TipoDocumento>

    // Asociación con el modelo TipoDocumento
    // public tipoDocumento?: TipoDocumento;

    // // Métodos de asociación
    // static associate(models: any) {
    //     Persona.belongsTo(models.TipoDocumento, {
    //         foreignKey: 'id_tipodocumento',
    //         as: 'tipoDocumento',
    //         onDelete: 'SET NULL'
    //     });
    // }
}

// export default (sequelize: Sequelize) => {
Persona.init({
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
    numero_documento: {
        type: new DataTypes.STRING(13),
        allowNull: false,
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
    nombre_completo: {
        type: new DataTypes.STRING(80),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_completo', value ? value.trim() : undefined)
        }
    },
    departamento: {
        type: new DataTypes.STRING(30),
        allowNull: true,
        set(value: string) {
            this.setDataValue('departamento', value ? value.trim() : undefined)
        }
    },
    provincia: {
        type: new DataTypes.STRING(30),
        allowNull: true,
        set(value: string) {
            this.setDataValue('provincia', value ? value.trim() : undefined)
        }
    },
    distrito: {
        type: new DataTypes.STRING(30),
        allowNull: true,
        set(value: string) {
            this.setDataValue('distrito', value ? value.trim() : undefined)
        }
    },
    direccion: {
        type: new DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            this.setDataValue('direccion', value ? value.trim() : undefined)
        }
    },
    direccion_completa: {
        type: new DataTypes.STRING(80),
        allowNull: true,
        set(value: string) {
            this.setDataValue('direccion_completa', value ? value.trim() : undefined)
        }
    },
    ubigeo_reniec: {
        type: new DataTypes.STRING(12),
        allowNull: true,
        set(value: string) {
            this.setDataValue('ubigeo_reniec', value ? value.trim() : undefined)
        }
    },
    ubigeo_sunat: {
        type: new DataTypes.STRING(12),
        allowNull: true,
        set(value: string) {
            this.setDataValue('ubigeo_sunat', value ? value.trim() : undefined)
        }
    },
    ubigeo: {
        type: new DataTypes.STRING(12),
        allowNull: true
    },
    fecha_nacimiento: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    estado_civil: {
        type: new DataTypes.STRING(10),
        allowNull: true,
        set(value: string) {
            this.setDataValue('estado_civil', value ? value.trim() : undefined)
        }
    },
    foto: {
        type: new DataTypes.STRING(100),
        allowNull: true,
        set(value: string) {
            this.setDataValue('foto', value ? value.trim() : undefined)
        }
    },
    sexo: {
        type: new DataTypes.STRING(2),
        allowNull: false,
        set(value: string) {
            this.setDataValue('sexo', value ? value.trim() : undefined)
        }
    },
    origen: {
        type: new DataTypes.STRING(30),
        allowNull: false,
        set(value: EOrigen) {
            this.setDataValue('origen', value ? (value as string).trim() as EOrigen : undefined)
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
    tableName: 'persona',
    modelName: 'Persona',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})

// return Persona;
// };