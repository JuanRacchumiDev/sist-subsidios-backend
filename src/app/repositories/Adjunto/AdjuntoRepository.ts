import sequelize from '../../../config/database'
import { AdjuntoResponse, AdjuntoResponsePaginate, IAdjunto, IAdjuntoPaginate } from "../../interfaces/Adjunto/IAdjunto";
import { Adjunto } from "../../models/Adjunto";
import { ADJUNTO_ATTRIBUTES } from "../../../constants/AjuntoConstant";
import HPagination from "../../../helpers/HPagination";
import { TIPO_ADJUNTO_INCLUDE } from "../../../includes/TipoAdjuntoInclude";
import { DESCANSOMEDICO_ADJ_INCLUDE } from "../../../includes/DescansoMedicoAdjInclude";
import { CANJE_INCLUDE } from "../../../includes/CanjeInclude";
import { COBRO_INCLUDE } from "../../../includes/CobroInclude";
import { REEMBOLSO_INCLUDE } from "../../../includes/ReembolsoInclude";
import { PERSONA_INCLUDE } from "../../../includes/PersonaInclude"
import { DOCUMENTO_TIPO_CONT_INCLUDE } from "../../../includes/DocumentoTipoContInclude";
import { Op, Transaction } from "sequelize";

interface IParamsValidarAdjunto {
    id_descansomedico: string;
    id_documento: string;
    codigo_temp: string;
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
                    DESCANSOMEDICO_ADJ_INCLUDE,
                    CANJE_INCLUDE,
                    COBRO_INCLUDE,
                    REEMBOLSO_INCLUDE,
                    PERSONA_INCLUDE,
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

    async getAllPaginate(page: number, limit: number): Promise<AdjuntoResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const { count, rows } = await Adjunto.findAndCountAll({
                attributes: ADJUNTO_ATTRIBUTES,
                include: [
                    TIPO_ADJUNTO_INCLUDE,
                    DESCANSOMEDICO_ADJ_INCLUDE,
                    CANJE_INCLUDE,
                    COBRO_INCLUDE,
                    REEMBOLSO_INCLUDE,
                    PERSONA_INCLUDE,
                    DOCUMENTO_TIPO_CONT_INCLUDE
                ],
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

    async getAllByCodigoTemp(codigoTemp: string): Promise<AdjuntoResponse> {
        try {
            const adjuntos = await Adjunto.findAll({
                attributes: ADJUNTO_ATTRIBUTES,
                where: {
                    codigo_temp: codigoTemp,
                    id_descansomedico: {
                        [Op.is]: null
                    }
                }
            });

            return { result: true, data: adjuntos, status: 200 };
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
                attributes: ADJUNTO_ATTRIBUTES
            }) as IAdjunto

            console.log({ adjunto })

            if (!adjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 404 }
            }

            return { result: true, data: adjunto, message: 'Adjunto encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getUniqueByParams(params: IParamsValidarAdjunto, transaction?: Transaction): Promise<AdjuntoResponse> {
        try {
            const { id_descansomedico, id_documento, codigo_temp } = params

            const existeAdjunto = await Adjunto.findOne({
                where: {
                    id_descansomedico,
                    id_documento,
                    codigo_temp
                },
                transaction
            })

            if (!existeAdjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 }
            }

            return { result: true, data: existeAdjunto, message: 'Adjunto encontrado', status: 200 }
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
        try {
            const newAdjunto = await Adjunto.create(data as IAdjunto)

            if (newAdjunto.id) {
                return { result: true, message: 'Adjunto registrado con éxito', data: newAdjunto, status: 200 }
            }

            return { result: false, error: 'Error al registrar el adjunto', data: [], status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza un adjunto existente por su ID
     * @param {string} id_descansomedico - El ID de un descanso médico
     * @param {string} id_documento - El ID de un documento 
     * @param {IAdjunto} data - Los nuevos datos del adjunto 
     * @returns {Promise<AdjuntoResponse>} Respuesta con el adjunto actualizado o error
     */
    async update(id_descansomedico: string, id_documento: string, data: IAdjunto): Promise<AdjuntoResponse> {
        try {
            const existeAdjunto = await Adjunto.findOne({
                where: {
                    id_descansomedico,
                    id_documento
                }
            })

            if (!existeAdjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 }
            }

            console.log({ existeAdjunto })

            const dataAdjunto: Partial<IAdjunto> = data

            console.log({ dataAdjunto })

            const updatedAdjunto = await existeAdjunto.update(dataAdjunto)

            return { result: true, message: 'Adjunto actualizado con éxito', data: updatedAdjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateByParams(data: IAdjunto): Promise<AdjuntoResponse> {
        try {
            // Obteniendo datos de adjunto
            const { id_descansomedico, id_documento } = data

            // Validando si exite un adjunto anterior para eliminarlo
            const existeAdjunto = await Adjunto.findOne({
                where: {
                    id_descansomedico,
                    id_documento
                }
            })

            if (!existeAdjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 }
            }

            const dataAdjunto: Partial<IAdjunto> = data

            const updatedAdjunto = await existeAdjunto.update(dataAdjunto)

            return { result: true, message: 'Adjunto actualizado con éxito', data: updatedAdjunto, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async updateDocsIniciales(idDescansoMedico: string, userCrea: string, codigoTemp: string): Promise<void> {
        try {
            const [numberOfUpdatedRows] = await Adjunto.update(
                { id_descansomedico: idDescansoMedico, user_crea: userCrea }, // Valores a actualizar
                {
                    where: {
                        codigo_temp: codigoTemp
                    },
                    returning: true,
                    paranoid: false
                }
            );

            console.log(`Se actualizaron ${numberOfUpdatedRows} registros.`);
        } catch (error) {
            console.error('Error al actualizar los registros:', error);
        }
    }

    async createMultiple(idsDescanso: string[], adjuntos: IAdjunto[], userCrea: string) {
        console.log('---- crear adjduntos múltiples ----')
        console.log({ idsDescanso })
        console.log({ adjuntos })

        const results: AdjuntoResponse[] = [];
        const transaction = await sequelize.transaction();

        try {
            for (const idItemDescanso of idsDescanso) {
                for (const adjunto of adjuntos) {
                    const { id_tipoadjunto, id_documento, file_name, file_type, file_path, id_persona, sistema, estado, codigo_temp } = adjunto as IAdjunto

                    console.log({ codigo_temp })

                    let paramsValidarAdjunto: IParamsValidarAdjunto = {
                        id_descansomedico: idItemDescanso,
                        id_documento: (id_documento as string) || '',
                        codigo_temp: (codigo_temp as string) || ''
                    }

                    const existeAdjunto = await this.getUniqueByParams(paramsValidarAdjunto, transaction)

                    console.log({ existeAdjunto })

                    const { result } = existeAdjunto

                    if (!result) {
                        const payloadAdjunto: IAdjunto = {
                            id_tipoadjunto,
                            id_descansomedico: idItemDescanso,
                            id_documento,
                            file_name,
                            file_type,
                            file_path,
                            id_persona,
                            user_crea: userCrea,
                            sistema,
                            codigo_temp,
                            estado
                        }

                        console.log({ payloadAdjunto })

                        const nuevoAdjunto = await Adjunto.create(payloadAdjunto)

                        results.push({
                            result: true,
                            message: 'Nuevo adjunto creado con éxito',
                            data: nuevoAdjunto,
                            status: 201
                        });
                    }
                }
            }

            await transaction.commit();
            return results;
        } catch (error) {
            await transaction.rollback();
            console.error('Error al crear adjuntos:', error);
            return [
                {
                    result: false,
                    error: "Error interno al procesar los adjuntos",
                    status: 500
                }
            ];
        }
    }

    /**
     * Elimina (lógicamente) un adjunto con su ID
     * @param {string} id - El ID del adjunto a eliminar 
     * @returns {Promise<AdjuntoResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<AdjuntoResponse> {
        try {
            const adjunto = await Adjunto.findByPk(id);

            if (!adjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 };
            }

            await adjunto.destroy();

            return { result: true, data: adjunto, message: 'Adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default AdjuntoRepository