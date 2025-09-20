import { DataTypes, Model, Optional } from 'sequelize'
import { ICanje } from '../interfaces/Canje/ICanje';
import { ECanje } from '../enums/ECanje';
import { DescansoMedico } from './DescansoMedico';
import sequelize from '../../config/database'
import { Reembolso } from './Reembolso';

interface CanjeCreationAttributes extends Optional<ICanje, 'id'> { }

export class Canje extends Model<ICanje, CanjeCreationAttributes> implements ICanje {
    public id?: string | undefined;
    public id_descansomedico?: string | undefined;
    public correlativo?: number | undefined;
    public codigo?: string | undefined;
    public codigo_canje?: string | undefined;
    public codigo_citt?: string | undefined;
    public fecha_inicio_subsidio?: string | undefined;
    public fecha_final_subsidio?: string | undefined;
    public fecha_inicio_dm?: string | undefined;
    public fecha_final_dm?: string | undefined;
    public fecha_canje?: string | undefined;
    public fecha_maxima_canje?: string | undefined;
    public fecha_registro?: string | undefined;
    public fecha_actualiza?: string | undefined;
    public fecha_elimina?: string | undefined;
    public fecha_maxima_subsanar?: string | undefined;
    public dia_fecha_inicio_subsidio?: number | undefined;
    public mes_fecha_inicio_subsidio?: number | undefined;
    public anio_fecha_inicio_subsidio?: number | undefined;
    public dia_fecha_final_subsidio?: number | undefined;
    public mes_fecha_final_subsidio?: number | undefined;
    public anio_fecha_final_subsidio?: number | undefined;
    public total_dias?: number | undefined;
    public is_reembolsable?: boolean | undefined;
    public observacion?: string | undefined;
    public mes_devengado?: string | undefined;
    public user_crea?: string | undefined;
    public user_actualiza?: string | undefined;
    public user_elimina?: string | undefined;
    public estado_registro?: ECanje | undefined;
    public sistema?: boolean | undefined;
    public estado?: boolean | undefined;

    // Timestamps
    public readonly created_at!: Date
    public readonly updated_at!: Date
    public readonly deleted_at!: Date

    // Asociaciones
    public getDescansoMedico!: () => Promise<DescansoMedico>
}

Canje.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_descansomedico: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: DescansoMedico,
            key: 'id'
        }
    },
    correlativo: {
        type: DataTypes.NUMBER,
        allowNull: false,
        autoIncrement: true
    },
    codigo: {
        type: new DataTypes.STRING(20),
        allowNull: true,
        set(value: string) {
            this.setDataValue('codigo', value ? value.trim() : undefined)
        }
    },
    codigo_canje: {
        type: new DataTypes.STRING(20),
        allowNull: true,
        set(value: string) {
            this.setDataValue('codigo_canje', value ? value.trim() : undefined)
        }
    },
    codigo_citt: {
        type: new DataTypes.STRING(20),
        allowNull: true,
        set(value: string) {
            this.setDataValue('codigo_citt', value ? value.trim() : undefined)
        }
    },
    fecha_inicio_subsidio: {
        type: new DataTypes.STRING(12),
        allowNull: false
    },
    fecha_final_subsidio: {
        type: new DataTypes.STRING(12),
        allowNull: false
    },
    fecha_inicio_dm: {
        type: new DataTypes.STRING(12),
        allowNull: false
    },
    fecha_final_dm: {
        type: new DataTypes.STRING(12),
        allowNull: false
    },
    fecha_canje: {
        type: new DataTypes.STRING(12),
        allowNull: true
    },
    fecha_maxima_canje: {
        type: new DataTypes.STRING(12),
        allowNull: false
    },
    fecha_registro: {
        type: new DataTypes.STRING(12),
        allowNull: true
    },
    fecha_actualiza: {
        type: new DataTypes.STRING(12),
        allowNull: true
    },
    fecha_elimina: {
        type: new DataTypes.STRING(12),
        allowNull: true
    },
    fecha_maxima_subsanar: {
        type: new DataTypes.STRING(12),
        allowNull: true
    },
    dia_fecha_inicio_subsidio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    mes_fecha_inicio_subsidio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    anio_fecha_inicio_subsidio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    dia_fecha_final_subsidio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    mes_fecha_final_subsidio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    anio_fecha_final_subsidio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    total_dias: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    is_reembolsable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    observacion: {
        type: DataTypes.TEXT,
        allowNull: true,
        set(value: string) {
            this.setDataValue('observacion', value ? value.trim() : undefined)
        }
    },
    mes_devengado: {
        type: DataTypes.STRING(12),
        allowNull: false,
        set(value: string) {
            this.setDataValue('mes_devengado', value ? value.trim() : undefined)
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
    estado_registro: {
        type: new DataTypes.STRING(30),
        allowNull: false
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
    tableName: 'canje',
    modelName: 'Canje',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})