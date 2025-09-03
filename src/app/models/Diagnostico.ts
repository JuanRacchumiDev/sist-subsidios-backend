import { DataTypes, Model, Optional } from 'sequelize'
import { IDiagnostico } from '../interfaces/Diagnostico/IDiagnostico';
import sequelize from '../../config/database'
import { DescansoMedico } from './DescansoMedico';

interface DiagnosticoCreationAttributes extends Optional<IDiagnostico, 'codCie10'> { }

export class Diagnostico extends Model<IDiagnostico, DiagnosticoCreationAttributes> implements IDiagnostico {
    public codCie10?: string | undefined;
    public nombre?: string | undefined;
    public nombre_url?: string | undefined;
    public tiempo?: number | undefined;
    public sexo?: string | undefined;
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
}

Diagnostico.init({
    codCie10: {
        type: DataTypes.STRING(10),
        field: 'codCie10',
        primaryKey: true,
        allowNull: false
    },
    nombre: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('nombre', value ? value.trim() : undefined)
        }
    },
    nombre_url: {
        type: new DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        set(value: string) {
            this.setDataValue('nombre_url', value ? value.trim() : undefined)
        }
    },
    tiempo: {
        type: DataTypes.NUMBER,
        allowNull: false
    },
    sexo: {
        type: DataTypes.CHAR(1),
        allowNull: true
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
    tableName: 'diagnostico',
    modelName: 'Diagnostico',
    sequelize,
    timestamps: true,
    paranoid: true,
    underscored: true
})