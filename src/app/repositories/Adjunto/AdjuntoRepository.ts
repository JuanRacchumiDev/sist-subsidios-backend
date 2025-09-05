import { DescansoMedico } from "../../models/DescansoMedico";
import { TipoAdjunto } from "../../models/TipoAdjunto";
import { Canje } from "../../models/Canje";
import { Cobro } from "../../models/Cobro";
import { Reembolso } from "../../models/Reembolso";
import { Colaborador } from "../../models/Colaborador";
import { TrabajadorSocial } from "../../models/TrabajadorSocial";
import { AdjuntoResponse, AdjuntoResponsePaginate, IAdjunto, IAdjuntoPaginate } from "../../interfaces/Adjunto/IAdjunto";
import { Adjunto } from "../../models/Adjunto";
import sequelize from '../../../config/database'
import fs from 'fs/promises'
import { ADJUNTO_ATTRIBUTES } from "../../../constants/AjuntoConstant";
import HPagination from "../../../helpers/HPagination";
import { DocumentoTipoCont } from "../../models/DocumentoTipoCont";

const TIPO_ADJUNTO_INCLUDE = {
    model: TipoAdjunto,
    as: 'tipoAdjunto',
    attributes: ['id', 'nombre']
}

const DESCANSO_MEDICO_INCLUDE = {
    model: DescansoMedico,
    as: 'descansoMedico',
    attributes: ['id', 'codigo', 'fecha_inicio', 'fecha_final']
}

const CANJE_INCLUDE = {
    model: Canje,
    as: 'canje',
    attributes: ['id', 'codigo', 'fecha_inicio_subsidio', 'fecha_final_subsidio']
}

const COBRO_INCLUDE = {
    model: Cobro,
    as: 'cobro',
    attributes: ['id', 'codigo', 'codigo_cheque', 'codigo_voucher']
}

const REEMBOLSO_INCLUDE = {
    model: Reembolso,
    as: 'reembolso',
    attributes: ['id', 'codigo']
}

const COLABORADOR_INCLUDE = {
    model: Colaborador,
    as: 'colaborador',
    attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno']
}

const TRABSOCIAL_INCLUDE = {
    model: TrabajadorSocial,
    as: 'trabajadorSocial',
    attributes: ['id', 'nombres', 'apellido_paterno', 'apellido_materno']
}

const DOCUMENTO_TIPO_CONT_INCLUDE = {
    model: DocumentoTipoCont,
    as: 'documentoTipoCont',
    attributes: ['id', 'nombre']
}

class AdjuntoRepository {
    /**
    * Obtiene todos los adjuntos
    * @returns {Promise<AdjuntoResponse>}
    */
    async getAll(): Promise<AdjuntoResponse> {
        try {
            const adjuntos = await Adjunto.findAll({
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    DESCANSO_MEDICO_INCLUDE,
                    CANJE_INCLUDE,
                    COBRO_INCLUDE,
                    REEMBOLSO_INCLUDE,
                    COLABORADOR_INCLUDE,
                    TRABSOCIAL_INCLUDE,
                    DOCUMENTO_TIPO_CONT_INCLUDE
                ],
                order: [
                    ['id', 'DESC']
                ]
            })

            return { result: true, data: adjuntos, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean): Promise<AdjuntoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Adjunto.findAndCountAll({
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    DESCANSO_MEDICO_INCLUDE,
                    CANJE_INCLUDE,
                    COBRO_INCLUDE,
                    REEMBOLSO_INCLUDE,
                    COLABORADOR_INCLUDE,
                    TRABSOCIAL_INCLUDE,
                    DOCUMENTO_TIPO_CONT_INCLUDE
                ],
                where: whereClause,
                order: [
                    ['id', 'DESC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IAdjuntoPaginate = {
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
    * Obtiene un adjunto por su ID
    * @param {string} id - El ID UUID del adjunto a buscar
    * @returns {Promise<AdjuntoResponse>} Respuesta con el adjunto encontrado o mensaje de no encontrado
    */
    async getById(id: string): Promise<AdjuntoResponse> {
        try {
            const adjunto = await Adjunto.findByPk(id, {
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    DESCANSO_MEDICO_INCLUDE,
                    CANJE_INCLUDE,
                    COBRO_INCLUDE,
                    REEMBOLSO_INCLUDE,
                    COLABORADOR_INCLUDE,
                    TRABSOCIAL_INCLUDE,
                    DOCUMENTO_TIPO_CONT_INCLUDE
                ]
            }) as IAdjunto

            if (!adjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 404 }
            }

            // Leer el archivo contenido desde la ruta guardada
            let fileContent: Buffer | null = null

            if (adjunto.file_path) {
                try {
                    fileContent = await fs.readFile(adjunto.file_path)
                    adjunto.file_data = fileContent
                } catch (readError) {
                    console.error('Error al leer el archivo: ', readError)
                }
            }

            return { result: true, data: adjunto, message: 'Adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
    * Crea un adjunto
    * @param {IAdjunto} data - Los datos del adjunto a crear 
    * @returns {Promise<AdjuntoResponse>} Respuesta con el adjunto creado o error
    */
    async create(data: IAdjunto): Promise<AdjuntoResponse> {

        // Accede a la instancia de Sequelize a través de db.sequelize
        const t = await sequelize.transaction()

        try {
            const newAdjunto = await Adjunto.create(data as IAdjunto, { transaction: t })

            await t.commit()

            if (newAdjunto.id) {
                return { result: true, message: 'Adjunto registrado con éxito', data: newAdjunto, status: 200 }
            }

            return { result: false, error: 'Error al registrar el adjunto', data: [], status: 500 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un adjunto existente por su ID
     * @param {string} id - El ID del adjunto a actualizar 
     * @param {IAdjunto} data - Los nuevos datos del adjunto 
     * @returns {Promise<AdjuntoResponse>} Respuesta con el adjunto actualizado o error
     */
    async update(id: string, data: IAdjunto): Promise<AdjuntoResponse> {

        // Accede a la instancia de Sequelize a travé de db.sequelize
        const t = await sequelize.transaction()

        try {
            const adjunto = await Adjunto.findByPk(id, { transaction: t })

            if (!adjunto) {
                await t.rollback();
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 }
            }

            const dataAdjunto: Partial<IAdjunto> = data

            const updatedAdjunto = await adjunto.update(dataAdjunto, { transaction: t })

            await t.commit()

            return { result: true, message: 'Adjunto actualizado con éxito', data: updatedAdjunto, status: 200 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (lógicamente) un adjunto con su ID
     * @param {string} id - El ID del adjunto a eliminar 
     * @returns {Promise<AdjuntoResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<AdjuntoResponse> {
        // Inicia la transacción
        const t = await sequelize.transaction()

        try {
            const adjunto = await Adjunto.findByPk(id, { transaction: t });

            if (!adjunto) {
                await t.rollback()
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 };
            }

            await adjunto.destroy({ transaction: t });

            await t.commit()

            return { result: true, data: adjunto, message: 'Adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new AdjuntoRepository()