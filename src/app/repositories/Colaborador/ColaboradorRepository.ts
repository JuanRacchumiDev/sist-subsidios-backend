import { IColaborador, ColaboradorResponse, ColaboradorResponsePaginate, IColaboradorPaginate } from "../../interfaces/Colaborador/IColaborador";
import { Area } from "../../models/Area";
import { Empresa } from "../../models/Empresa";
import { Pais } from "../../models/Pais";
import { Sede } from "../../models/Sede";
import { TipoDocumento } from "../../models/TipoDocumento";
import { Colaborador } from "../../models/Colaborador";
import sequelize from '../../../config/database'
import { TValidateFields } from "../../types/TTypeFields";
import { Op } from "sequelize";
import { COLABORADOR_ATTRIBUTES } from "../../../constants/ColaboradorConstant";
import HPagination from "../../../helpers/HPagination";

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

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<ColaboradorResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Colaborador.findAndCountAll({
                attributes: COLABORADOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    AREA_INCLUDE,
                    SEDE_INCLUDE,
                    PAIS_INCLUDE
                ],
                where: whereClause,
                order: [
                    ['apellido_paterno', 'ASC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IColaboradorPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: count,
                nextPage,
                previousPage
            }

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            }

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
     * Obtiene un colaborador por tipo y número de documento
     * @param {string} idTipoDoc - El ID del tipo de documento del colaborador a buscar
     * @param {string} numDoc - El número de documento del colaborador a buscar
     * @returns {Promise<ColaboradorResponse>}
     */
    async getByIdTipoDocAndNumDoc(idTipoDoc: string, numDoc: string): Promise<ColaboradorResponse> {
        try {
            const colaborador = await Colaborador.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: COLABORADOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    AREA_INCLUDE,
                    SEDE_INCLUDE,
                    PAIS_INCLUDE
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
     * Obtiene un listado de colaboradores por id de empresa 
     * @param {string} idEmpresa - El ID de la empresa 
     * @returns {Promise<ColaboradorResponse>}
     */
    async getByIdEmpresa(idEmpresa: string): Promise<ColaboradorResponse> {
        try {
            const colaboradores = await Colaborador.findOne({
                where: {
                    id_empresa: idEmpresa
                },
                attributes: COLABORADOR_ATTRIBUTES,
                include: [
                    TIPO_DOCUMENTO_INCLUDE,
                    EMPRESA_INCLUDE,
                    AREA_INCLUDE,
                    SEDE_INCLUDE,
                    PAIS_INCLUDE
                ]
            })

            if (!colaboradores) {
                return { result: false, data: [], message: 'Colaboradores no encontrados', status: 404 }
            }

            return { result: true, data: colaboradores, message: 'Colaboradores encontrados', status: 200 }
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
            const {
                numero_documento,
                correo_personal,
                correo_institucional,
                numero_celular,
                id_empresa
            } = data

            if (
                !numero_documento ||
                !correo_personal ||
                !correo_institucional ||
                !numero_celular ||
                !id_empresa
            ) {
                return {
                    result: false,
                    message: "El número de documento, correo personal, correo institucional, número celular o empresa son requeridos"
                }
            }

            const fields = {
                numero_documento,
                correo_personal,
                correo_institucional,
                numero_celular
            }

            const validateFields = await this.validateFieldsRegistered(fields, "crear")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
            }

            const newColaborador = await Colaborador.create(data as IColaborador)

            await t.commit()

            const { id } = newColaborador

            if (id) {
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
                return { result: false, data: [], message: 'Colaborador no encontrado', status: 404 }
            }

            const { numero_documento, correo_personal, correo_institucional, numero_celular } = data

            const fields = { numero_documento, correo_personal, correo_institucional, numero_celular }

            const validateFields = await this.validateFieldsRegistered(fields, "actualizar")

            const { result: resultValidate, message: messageValidate } = validateFields

            if (resultValidate) {
                return { result: !resultValidate, message: messageValidate, status: 409 }
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

            await colaborador.destroy({ transaction: t });

            await t.commit()

            return { result: true, data: colaborador, message: 'Colaborador eliminado correctamente', status: 200 };
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }

    async validateFieldsRegistered(
        fields: {
            numero_documento?: string,
            correo_personal?: string,
            correo_institucional?: string
        },
        accion: string
    ): Promise<TValidateFields> {
        const { numero_documento, correo_personal, correo_institucional } = fields

        let returnValidate: TValidateFields = {
            result: false,
            message: ""
        }

        if (numero_documento || correo_personal || correo_institucional) {
            const whereConditions: any[] = []

            if (numero_documento) {
                whereConditions.push({ numero_documento })
            }

            if (correo_personal) {
                whereConditions.push({ correo_personal })
            }

            if (correo_institucional) {
                whereConditions.push({ correo_institucional })
            }

            const existingColaborador = await Colaborador.findOne({
                where: {
                    [Op.or]: whereConditions
                }
            })

            if (existingColaborador) {
                const message = `El número de documento, correo personal o institucional por ${accion} ya existen`
                returnValidate.result = true
                returnValidate.message = message
            }
        }

        return returnValidate
    }
}

export default new ColaboradorRepository()