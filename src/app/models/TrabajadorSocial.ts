import { DataTypes, Model, Optional } from 'sequelize'
import { ITrabajadorSocial } from "../interfaces/TrabajadorSocial/ITrabajadorSocial";
import sequelize from '../../config/database'
import { TipoDocumento } from './TipoDocumento';
import { Cargo } from './Cargo';
import { Area } from './Area';
import { Sede } from './Sede';
import { Pais } from './Pais';
import { Empresa } from './Empresa';

interface TrabajadorSocialCreationAttributes extends Optional<ITrabajadorSocial, 'id'> { }

export class TrabajadorSocial extends Model<ITrabajadorSocial, TrabajadorSocialCreationAttributes> implements ITrabajadorSocial {
    public id?: string | undefined;
    public id_tipodocumento?: string | undefined;
    public id_cargo?: string | undefined;
    public id_empresa?: string | undefined;
    public id_area?: string | undefined;
    public id_sede?: string | undefined;
    public id_pais?: string | undefined;
    public numero_documento?: string | undefined;
    public apellido_paterno?: string | undefined;
    public apellido_materno?: string | undefined;
    public nombres?: string | undefined;
    public nombre_completo?: string | undefined;
    public nombre_area?: string | undefined;
    public nombre_sede?: string | undefined;
    public nombre_pais?: string | undefined;
    public correo_institucional?: string | undefined;
    public correo_personal?: string | undefined;
    public numero_celular?: string | undefined;
    public foto?: string | undefined;
    public fecha_nacimiento?: string | undefined;
    public fecha_ingreso?: string | undefined;
    public fecha_salida?: string | undefined;
    public es_representante_legal?: boolean | undefined;
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
    public getCargo!: () => Promise<Cargo>
    public getEmpresa!: () => Promise<Empresa>
    public getArea?: () => Promise<Area>
    public getSede?: () => Promise<Sede>
    public getPais?: () => Promise<Pais>
}

TrabajadorSocial.init({
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
    id_cargo: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Cargo,
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
    id_area: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Area,
            key: 'id'
        }
    },
    id_sede: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Sede,
            key: 'id'
        }
    },
    id_pais: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Pais,
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
    nombres: {
        type: new DataTypes.STRING(40),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombres', value ? value.trim() : undefined)
        }
    },
    nombre_completo: {
        type: new DataTypes.STRING(80),
        allowNull: false,
        get() {
            return `${this.nombres || ''} ${this.apellido_paterno || ''} ${this.apellido_materno || ''}`.trim()
        }
    },
    nombre_area: {
        type: new DataTypes.STRING(30),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_area', value ? value.trim() : undefined)
        }
    },
    nombre_sede: {
        type: new DataTypes.STRING(30),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_sede', value ? value.trim() : undefined)
        }
    },
    nombre_pais: {
        type: new DataTypes.STRING(30),
        allowNull: true,
        set(value: string) {
            this.setDataValue('nombre_pais', value ? value.trim() : undefined)
        }
    },
    correo_institucional: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        set(value: string) {
            this.setDataValue('correo_institucional', value ? value.trim() : undefined)
        }
    },
    correo_personal: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        set(value: string) {
            this.setDataValue('correo_personal', value ? value.trim() : undefined)
        }
    },
    numero_celular: {
        type: new DataTypes.STRING(13),
        allowNull: false,
        set(value: string) {
            this.setDataValue('numero_celular', value ? value.trim() : undefined)
        }
    },
    foto: {
        type: new DataTypes.STRING(100),
        allowNull: true,
        set(value: string) {
            this.setDataValue('foto', value ? value.trim() : undefined)
        }
    },
    fecha_nacimiento: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    fecha_ingreso: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    fecha_salida: {
        type: new DataTypes.STRING(10),
        allowNull: true
    },
    es_representante_legal: {
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
    tableName: 'trabajador_social',
    modelName: 'TrabajadorSocial',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
});