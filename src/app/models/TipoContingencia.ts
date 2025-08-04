import { DataTypes, Model, Optional } from 'sequelize'
import { ITipoContingencia } from '../interfaces/TipoContingencia/ITipoContingencia';
import sequelize from '../../config/database'
import { DescansoMedico } from './DescansoMedico';

// Define los atributos opcionales cuando se crea una instancia del modelo
interface TipoContingenciaAttributes extends Optional<ITipoContingencia, 'id'> { }

export class TipoContingencia extends Model<ITipoContingencia, TipoContingenciaAttributes> implements ITipoContingencia {
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
    public getDescansosMedicos!: () => Promise<DescansoMedico[]>

    // Métodos de asociación
    // static associate(models: any) {
    //     TipoContingencia.hasMany(models.DescansoMedico, {
    //         foreignKey: 'id_tipocontingencia',
    //         as: 'descansosmedicos',
    //         onDelete: 'SET NULL'
    //     });
    // }
}

// export default (sequelize: Sequelize) => {
TipoContingencia.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('nombre', value ? value.trim() : undefined)
        }
    },
    nombre_url: {
        type: new DataTypes.STRING(60),
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
    tableName: 'tipo_contingencia',
    modelName: 'TipoContingencia',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})

// return TipoContingencia;
// };