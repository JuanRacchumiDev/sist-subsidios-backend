import { IColaborador, ColaboradorResponse } from "@/interfaces/Colaborador/IColaborador";
import { Area } from "@/models/Area";
import { Empresa } from "@/models/Empresa";
import { Pais } from "@/models/Pais";
import { Sede } from "@/models/Sede";
import { TipoDocumento } from "@/models/TipoDocumento";
import { Colaborador } from "@/models/Colaborador";
import sequelize from '../../../config/database'

const COLABORADOR_ATTRIBUTES = [
    'id',
    'id_parentesco',
    'id_tipodocumento',
    'id_area',
    'id_sede',
    'id_pais',
    'id_empresa',
    'numero_documento',
    'apellido_paterno',
    'apellido_materno',
    'nombres',
    'nombre_completo',
    'fecha_nacimiento',
    'fecha_ingreso',
    'fecha_salida',
    'nombre_area',
    'nombre_sede',
    'nombre_pais',
    'correo_institucional',
    'correo_personal',
    'numero_celular',
    'contacto_emergencia',
    'numero_celular_emergencia',
    'foto',
    'curriculum_vitae',
    'is_asociado_sindicato',
    'is_presenta_inconvenientes',
    'estado'
];

const TIPO_DOCUMENTO_INCLUDE = {
    model: TipoDocumento,
    as: 'tipoDocumento',
    attributes: ['id', 'nombre', 'abreviatura']
}

const EMPRESA_INCLUDE = {
    model: Empresa,
    as: 'empresa',
    attributes: ['id', 'nombre_o_razon_social']
}

const AREA_INCLUDE = {
    model: Area,
    as: 'area',
    attributes: ['id', 'nombre']
}

const SEDE_INCLUDE = {
    model: Sede,
    as: 'sede',
    attributes: ['id', 'nombre']
}

const PAIS_INCLUDE = {
    model: Pais,
    as: 'pais',
    attributes: ['id', 'nombre']
}

class ColaboradorRepository {
    /**
    * Obtiene todos los colaboradores
    * @returns {Promise<ColaboradorResponse>}
    */
    async getAll(): Promise<ColaboradorResponse> {
        try {
            const colaboradores = await Colaborador.findAll({
                attributes: COLABORADOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    AREA_INCLUDE,
                    SEDE_INCLUDE,
                    PAIS_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: colaboradores, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Obtiene un colaborador por su ID
    * @param {string} id - El ID UUID del colaborador a buscar
    * @returns {Promise<ColaboradorResponse>} Respuesta con el colaborador encontrado o mensaje de no encontrado
    */
    async getById(id: string): Promise<ColaboradorResponse> {
        try {
            const colaborador = await Colaborador.findByPk(id, {
                attributes: COLABORADOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    AREA_INCLUDE,
                    SEDE_INCLUDE,
                    PAIS_INCLUDE
                ],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            if (!colaborador) {
                return { result: false, data: [], message: 'Colaborador no encontrado', status: 404 }
            }

            return { result: true, data: colaborador, message: 'Colaborador encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Crea un colaborador
    * @param {IColaborador} data - Los datos del colaborador a crear 
    * @returns {Promise<ColaboradorResponse>} Respuesta con el colaborador creado o error
    */
    async create(data: IColaborador): Promise<ColaboradorResponse> {

        // Accede a la instancia de Sequelize a través de db.sequelize
        const t = await sequelize.transaction()

        try {
            const newColaborador = await Colaborador.create(data as any)

            await t.commit()

            if (newColaborador.id) {
                return { result: true, message: 'Colaborador registrado con éxito', data: newColaborador, status: 200 }
            }

            return { result: false, error: 'Error al registrar al colaborador', data: [], status: 500 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un colaborador existente por su ID
     * @param {string} id - El ID del colaborador a actualizar 
     * @param {IColaborador} data - Los nuevos datos del colaborador 
     * @returns {Promise<ColaboradorResponse>} Respuesta con el colaborador actualizado o error
     */
    async update(id: string, data: IColaborador): Promise<ColaboradorResponse> {

        // Accede a la instancia de Sequelize a travé de db.sequelize
        const t = await sequelize.transaction()

        try {
            const colaborador = await Colaborador.findByPk(id, { transaction: t })

            if (!colaborador) {
                await t.rollback();
                return { result: false, data: [], message: 'Colaborador no encontrado', status: 200 }
            }

            const dataColaborador: Partial<IColaborador> = data

            const updatedColaborador = await colaborador.update(dataColaborador, { transaction: t })

            await t.commit()

            return { result: true, message: 'Colaborador actualizado con éxito', data: updatedColaborador, status: 200 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (lógicamente) un colaborador con su ID
     * @param {string} id - El ID del colaborador a eliminar 
     * @returns {Promise<ColaboradorResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<ColaboradorResponse> {
        // Inicia la transacción
        const t = await sequelize.transaction()

        try {
            const colaborador = await Colaborador.findByPk(id, { transaction: t });

            if (!colaborador) {
                await t.rollback()
                return { result: false, data: [], message: 'Colaborador no encontrado', status: 200 };
            }

            await Colaborador.destroy({ transaction: t });

            await t.commit()

            return { result: true, data: colaborador, message: 'Colaborador eliminado correctamente', status: 200 };
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new ColaboradorRepository()