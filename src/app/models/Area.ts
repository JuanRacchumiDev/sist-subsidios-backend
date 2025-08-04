import { DataTypes, Model, Optional } from 'sequelize'
import { IArea } from '../interfaces/Area/IArea';
import sequelize from '../../config/database'
import { Colaborador } from './Colaborador';
import { TrabajadorSocial } from './TrabajadorSocial';

// Define los atributos opcionales cuando se crea una instancia del modelo
interface AreaCreationAttributes extends Optional<IArea, 'id'> { }

export class Area extends Model<IArea, AreaCreationAttributes> implements IArea {
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

    // Métodos de asociación
    // static associate(model: any) {
    //     // Un área puede tener muchos colaboradores
    //     Area.hasMany(model.Colaborador, {
    //         foreignKey: 'id_area',
    //         as: 'colaboradores',
    //         onDelete: 'SET NULL'
    //     });
    // }
}

// export default (sequelize: Sequelize) => {
Area.init({
    id: {
        type: DataTypes.UUIDV4,
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
    tableName: 'area',
    modelName: 'Area',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})

// return Area;
// };