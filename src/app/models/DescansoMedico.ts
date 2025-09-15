import { DataTypes, Model, Optional } from 'sequelize'
import { IDescansoMedico } from '../interfaces/DescansoMedico/IDescansoMedico';
import { EDescansoMedico } from '../enums/EDescansoMedico';
import { Colaborador } from './Colaborador';
import { TipoDescansoMedico } from './TipoDescansoMedico';
import { TipoContingencia } from './TipoContingencia';
import { Diagnostico } from './Diagnostico';
import sequelize from '../../config/database'

interface DescansoMedicoCreationAttributes extends Optional<IDescansoMedico, 'id'> { }

export class DescansoMedico extends Model<IDescansoMedico, DescansoMedicoCreationAttributes> implements IDescansoMedico {
    public id?: string | undefined;
    public id_colaborador?: string | undefined;
    public id_tipodescansomedico?: string | undefined;
    public id_tipocontingencia?: string | undefined;
    public codcie10_diagnostico?: string | undefined;
    public correlativo?: number | undefined;
    public codigo?: string | undefined;
    public fecha_otorgamiento?: string | undefined;
    public fecha_inicio?: string | undefined;
    public fecha_final?: string | undefined;
    public fecha_registro?: string | undefined;
    public fecha_actualiza?: string | undefined;
    public fecha_elimina?: string | undefined;
    public fecha_maxima_subsanar?: string | undefined;
    public dia_fecha_inicio?: number | undefined;
    public mes_fecha_inicio?: number | undefined;
    public anio_fecha_inicio?: number | undefined;
    public dia_fecha_final?: number | undefined;
    public mes_fecha_final?: number | undefined;
    public anio_fecha_final?: number | undefined;
    public mes_devengado?: string | undefined;
    public numero_colegiatura?: string | undefined;
    public medico_tratante?: string | undefined;
    public nombre_colaborador?: string | undefined;
    public nombre_tipodescansomedico?: string | undefined;
    public nombre_tipocontingencia?: string | undefined;
    public nombre_diagnostico?: string | undefined;
    public nombre_establecimiento?: string | undefined;
    public observacion?: string | undefined;
    public total_dias?: number | undefined;
    public codigo_temp?: string | undefined;
    public is_subsidio?: boolean | undefined;
    public is_acepta_responsabilidad?: boolean | undefined;
    public is_acepta_politica?: boolean | undefined;
    public is_continuo?: boolean | undefined;
    public estado_registro?: EDescansoMedico | undefined;
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
    public getColaborador!: () => Promise<Colaborador>
    public getTipoDescansoMedico!: () => Promise<TipoDescansoMedico>
    public getTipoContingencia!: () => Promise<TipoContingencia>
    public getDiagnostico!: () => Promise<Diagnostico>
}

DescansoMedico.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    id_colaborador: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Colaborador,
            key: 'id'
        }
    },
    id_tipodescansomedico: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: DescansoMedico,
            key: 'id'
        }
    },
    id_tipocontingencia: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: TipoContingencia,
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
        unique: true
    },
    fecha_otorgamiento: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    fecha_inicio: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    fecha_final: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    fecha_registro: {
        type: new DataTypes.STRING(10),
        allowNull: false
    },
    fecha_actualiza: {
        type: new DataTypes.STRING(10),
        allowNull: true
    },
    fecha_elimina: {
        type: new DataTypes.STRING(10),
        allowNull: true
    },
    fecha_maxima_subsanar: {
        type: new DataTypes.STRING(10),
        allowNull: true
    },
    dia_fecha_inicio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    mes_fecha_inicio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    anio_fecha_inicio: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    dia_fecha_final: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    mes_fecha_final: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    anio_fecha_final: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    mes_devengado: {
        type: new DataTypes.STRING(12),
        allowNull: false
    },
    numero_colegiatura: {
        type: new DataTypes.STRING(10),
        allowNull: false,
        set(value: string) {
            this.setDataValue('numero_colegiatura', value ? value.trim() : undefined)
        }
    },
    medico_tratante: {
        type: new DataTypes.STRING(80),
        allowNull: false,
        set(value: string) {
            this.setDataValue('medico_tratante', value ? value.trim() : undefined)
        }
    },
    nombre_colaborador: {
        type: new DataTypes.STRING(80),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_colaborador', value ? value.trim() : undefined)
        }
    },
    nombre_tipodescansomedico: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_tipodescansomedico', value ? value.trim() : undefined)
        }
    },
    nombre_tipocontingencia: {
        type: new DataTypes.STRING(50),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_tipocontingencia', value ? value.trim() : undefined)
        }
    },
    nombre_diagnostico: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        set(value: string) {
            this.setDataValue('nombre_diagnostico', value ? value.trim() : undefined)
        }
    },
    nombre_establecimiento: {
        type: new DataTypes.STRING(100),
        allowNull: true,
        set(value: string) {
            this.setDataValue('nombre_establecimiento', value ? value.trim() : undefined)
        }
    },
    observacion: {
        type: new DataTypes.TEXT,
        allowNull: true,
        set(value: string) {
            this.setDataValue('observacion', value ? value.trim() : undefined)
        }
    },
    total_dias: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    codigo_temp: {
        type: new DataTypes.STRING(10),
        allowNull: true,
        set(value: string) {
            this.setDataValue('codigo_temp', value ? value.trim() : undefined)
        }
    },
    is_subsidio: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_acepta_responsabilidad: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_continuo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    estado_registro: {
        type: new DataTypes.STRING(50),
        allowNull: false
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
    tableName: 'descanso_medico',
    modelName: 'DescansoMedico',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})