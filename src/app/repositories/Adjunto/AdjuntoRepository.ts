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
import { TIPO_ADJUNTO_INCLUDE } from "../../../includes/TipoAdjuntoInclude";
import { DESCANSOMEDICO_ADJ_INCLUDE } from "../../../includes/DescansoMedicoAdjInclude";
import { CANJE_INCLUDE } from "../../../includes/CanjeInclude";
import { COBRO_INCLUDE } from "../../../includes/CobroInclude";
import { REEMBOLSO_INCLUDE } from "../../../includes/ReembolsoInclude";
import { COLABORADOR_INCLUDE } from "../../../includes/ColaboradorInclude";
import { TRABAJADOR_SOCIAL_INCLUDE } from "../../../includes/TrabSocialInclude";
import { DOCUMENTO_TIPO_CONT_INCLUDE } from "../../../includes/DocumentoTipoContInclude";
import { Op } from "sequelize";
import { COLABORADOR_ATTRIBUTES } from "../../../constants/ColaboradorConstant";

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
                    COLABORADOR_INCLUDE,
                    TRABAJADOR_SOCIAL_INCLUDE,
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

    async getAllWithPaginate(page: number, limit: number): Promise<AdjuntoResponsePaginate> {
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
                    COLABORADOR_INCLUDE,
                    TRABAJADOR_SOCIAL_INCLUDE,
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

            if (!adjunto) {
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 404 }
            }

            console.log({ adjunto })

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
        // const transaction = await sequelize.transaction()

        try {
            // const newAdjunto = await Adjunto.create(data as IAdjunto, { transaction })
            const newAdjunto = await Adjunto.create(data as IAdjunto)

            // await transaction.commit()

            if (newAdjunto.id) {
                return { result: true, message: 'Adjunto registrado con éxito', data: newAdjunto, status: 200 }
            }

            return { result: false, error: 'Error al registrar el adjunto', data: [], status: 500 }
        } catch (error) {
            // await transaction.rollback()
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
        // const transaction = await sequelize.transaction()

        try {
            // const adjunto = await Adjunto.findByPk(id, { transaction })
            const adjunto = await Adjunto.findByPk(id)

            if (!adjunto) {
                // await transaction.rollback();
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 }
            }

            const dataAdjunto: Partial<IAdjunto> = data

            // const updatedAdjunto = await adjunto.update(dataAdjunto, { transaction })

            // await transaction.commit()

            const updatedAdjunto = await adjunto.update(dataAdjunto)

            // await transaction.commit()

            return { result: true, message: 'Adjunto actualizado con éxito', data: updatedAdjunto, status: 200 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza registros de adjuntos basados en un código temporal.
     * @param {string} idDescansoMedico - ID del descanso médico.
     * @param {string} codigoTemp - El código temporal usado para identificar los adjuntos.
     * @returns {Promise<void>} Respuesta de las operaciones de la base de datos.
     */
    async updateForCodeTemp(idDescansoMedico: string, codigoTemp: string): Promise<void> {
        try {
            const [numberOfUpdatedRows] = await Adjunto.update(
                { id_descansomedico: idDescansoMedico }, // Valores a actualizar
                // { where: { codigo_temp: codigoTemp, id_descansomedico: null } } // Condición
                {
                    where: {
                        codigo_temp: codigoTemp,
                        // id_descansomedico: undefined
                    }
                }
            );

            console.log(`Se actualizaron ${numberOfUpdatedRows} registros.`);
        } catch (error) {
            console.error('Error al actualizar los registros:', error);
        }

        // // Accede a la instancia de Sequelize a travé de db.sequelize
        // const transaction = await sequelize.transaction()

        // try {
        //     const adjunto = await Adjunto.findByPk(id, { transaction })

        //     if (!adjunto) {
        //         await transaction.rollback();
        //         return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 }
        //     }

        //     const dataAdjunto: Partial<IAdjunto> = data

        //     const updatedAdjunto = await adjunto.update(dataAdjunto, { transaction })

        //     await transaction.commit()

        //     return { result: true, message: 'Adjunto actualizado con éxito', data: updatedAdjunto, status: 200 }
        // } catch (error) {
        //     await transaction.rollback()
        //     const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        //     return { result: false, error: errorMessage, status: 500 }
        // }
    }

    /**
     * Actualiza registros de adjuntos basados en un código temporal.
     * @param {string[]} idDescansosMedicos - Array de IDs de los descansos médicos.
     * @param {string} codigoTemp - El código temporal usado para identificar los adjuntos.
     * @returns {Promise<AdjuntoResponse[]>} Respuesta de las operaciones de la base de datos.
     */
    async updateAndCreateForCodeTemp(idDescansosMedicos: string[], codigoTemp: string): Promise<AdjuntoResponse[]> {
        const transaction = await sequelize.transaction();
        const results: AdjuntoResponse[] = [];

        try {
            // Buscar el adjunto original con el código temporal
            const adjuntoOriginal = await Adjunto.findOne({
                where: { codigo_temp: codigoTemp },
                transaction
            });

            if (!adjuntoOriginal) {
                await transaction.rollback();
                console.error("No se encontró ningún adjunto con el código temporal.");
                return [
                    {
                        result: false,
                        error: "No se encontró ningún adjunto",
                        status: 404
                    }
                ];
            }

            console.log({ adjuntoOriginal })

            // const [numberOfUpdatedRows] = await Adjunto.update(
            //     { id_descansomedico: idDescansoMedico }, // Valores a actualizar
            //     // { where: { codigo_temp: codigoTemp, id_descansomedico: null } } // Condición
            //     {
            //         where: {
            //             codigo_temp: codigoTemp,
            //             // id_descansomedico: undefined
            //         }
            //     }
            // );

            // Actualizar el adjunto original con el primer id de descanso médico
            // await adjuntoOriginal.update(
            //     {
            //         id_descansomedico: idDescansosMedicos[0],
            //         // codigo_temp: null, // Limpiamos el código temporal para evitar duplicados
            //     },
            //     { transaction }
            // );

            await Adjunto.update(
                { id_descansomedico: idDescansosMedicos[0] }, // Valores a actualizar
                // { where: { codigo_temp: codigoTemp, id_descansomedico: null } } // Condición
                {
                    where: {
                        codigo_temp: codigoTemp,
                        // id_descansomedico: undefined
                    }
                }
            )

            results.push({
                result: true,
                message: 'Adjunto actualizado con éxito',
                data: adjuntoOriginal,
                status: 200
            });

            // Si hay más de un descanso médico, creamos nuevos registros
            for (let i = 1; i < idDescansosMedicos.length; i++) {
                const nuevoAdjunto = await Adjunto.create(
                    {
                        id_tipoadjunto: adjuntoOriginal.id_tipoadjunto,
                        id_descansomedico: idDescansosMedicos[i],
                        id_documento: adjuntoOriginal.id_documento,
                        file_name: adjuntoOriginal.file_name,
                        file_type: adjuntoOriginal.file_type,
                        file_path: adjuntoOriginal.file_path,
                        // Asignamos el resto de campos relevantes del adjunto original
                        id_colaborador: adjuntoOriginal.id_colaborador,
                        user_crea: adjuntoOriginal.user_crea,
                        sistema: adjuntoOriginal.sistema,
                        estado: adjuntoOriginal.estado,
                    } as IAdjunto,
                    { transaction }
                );

                results.push({
                    result: true,
                    message: 'Nuevo adjunto creado con éxito',
                    data: nuevoAdjunto,
                    status: 201
                });
            }

            await transaction.commit();
            return results;
        } catch (error) {
            await transaction.rollback();
            console.error('Error al actualizar y/o crear adjuntos:', error);
            return [{ result: false, error: "Error interno al procesar los adjuntos", status: 500 }];
        }
    }

    /**
     * Elimina (lógicamente) un adjunto con su ID
     * @param {string} id - El ID del adjunto a eliminar 
     * @returns {Promise<AdjuntoResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<AdjuntoResponse> {
        // Inicia la transacción
        // const transaction = await sequelize.transaction()

        try {
            // const adjunto = await Adjunto.findByPk(id, { transaction });
            const adjunto = await Adjunto.findByPk(id);

            if (!adjunto) {
                // await transaction.rollback()
                return { result: false, data: [], message: 'Adjunto no encontrado', status: 200 };
            }

            // await adjunto.destroy({ transaction });
            await adjunto.destroy();

            // await transaction.commit()

            return { result: true, data: adjunto, message: 'Adjunto eliminado correctamente', status: 200 };
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

// export default new AdjuntoRepository()

export default AdjuntoRepository