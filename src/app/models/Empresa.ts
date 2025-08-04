import { DataTypes, Model, Optional } from 'sequelize'
import { IEmpresa } from '../interfaces/Empresa/IEmpresa';
import sequelize from '../../config/database'
import { Colaborador } from './Colaborador';

// Define los atributos opcionales cuando se crea una instancia del modelo
interface EmpresaCreationAttributes extends Optional<IEmpresa, 'id'> { }

export class Empresa extends Model<IEmpresa, EmpresaCreationAttributes> implements IEmpresa {
    public id?: string | undefined;
    public numero?: string | undefined;
    public nombre_o_razon_social?: string | undefined;
    public direccion?: string | undefined;
    public direccion_completa?: string | undefined;
    public distrito?: string | undefined;
    public provincia?: string | undefined;
    public tipo_contribuyente?: string | undefined;
    public estado_sunat?: string | undefined;
    public condicion_sunat?: string | undefined;
    public ubigeo_sunat?: string | undefined;
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
    public getColaboradores!: () => Promise<Colaborador[]>

    // Métodos de asociación
    // static associate(models: any) {
    //     Empresa.hasMany(models.Colaborador, {
    //         foreignKey: 'id_empresa',
    //         as: 'usuarios',
    //         onDelete: 'SET NULL'
    //     });
    // }
}

// export default (sequelize: Sequelize) => {
Empresa.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    numero: {
        type: new DataTypes.STRING(13),
        allowNull: false,
        set(value: string) {
            this.setDataValue('numero', value ? value.trim() : undefined)
        }
    },
    nombre_o_razon_social: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_o_razon_social', value ? value.trim() : undefined)
        }
    },
    tipo_contribuyente: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        set(value: string) {
            this.setDataValue('tipo_contribuyente', value ? value.trim() : undefined)
        }
    },
    estado_sunat: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        set(value: string) {
            this.setDataValue('estado_sunat', value ? value.trim() : undefined)
        }
    },
    condicion_sunat: {
        type: new DataTypes.STRING(20),
        allowNull: false,
        set(value: string) {
            this.setDataValue('condicion_sunat', value ? value.trim() : undefined)
        }
    },
    departamento: {
        type: new DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            this.setDataValue('departamento', value ? value.trim() : undefined)
        }
    },
    provincia: {
        type: new DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            this.setDataValue('provincia', value ? value.trim() : undefined)
        }
    },
    distrito: {
        type: new DataTypes.STRING(50),
        allowNull: true,
        set(value: string) {
            this.setDataValue('distrito', value ? value.trim() : undefined)
        }
    },
    direccion: {
        type: new DataTypes.STRING(80),
        allowNull: false,
        set(value: string) {
            this.setDataValue('direccion', value ? value.trim() : undefined)
        }
    },
    direccion_completa: {
        type: new DataTypes.STRING(150),
        allowNull: false,
        set(value: string) {
            this.setDataValue('direccion_completa', value ? value.trim() : undefined)
        }
    },
    ubigeo_sunat: {
        type: new DataTypes.STRING(10),
        allowNull: true,
        set(value: string) {
            this.setDataValue('ubigeo_sunat', value ? value.trim() : undefined)
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
    tableName: 'empresa',
    modelName: 'Empresa',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})

// return Empresa;
// };