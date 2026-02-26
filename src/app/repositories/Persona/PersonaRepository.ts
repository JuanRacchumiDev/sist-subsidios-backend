import sequelize from '../../../config/database'
// import { PERFIL_ATTRIBUTES } from '../../../constants/PerfilConstant';
import { PERSONA_ATTRIBUTES } from '../../../constants/PersonaConstant';
import { DETALLE_PARAMETRO_INCLUDE } from '../../../includes/DetalleParametroInclude'
// import { TIPO_DOCUMENTO_INCLUDE } from '../../../includes/TipoDocumentoInclude';
import { IPersona, IPersonaPaginate, PersonaResponse, PersonaResponsePaginate } from "../../interfaces/Persona/IPersona";
import { Persona } from "../../models/Persona";
import { DetalleParametro } from "../../models/DetalleParametro"
import { Op } from 'sequelize';
import HPagination from "../../../helpers/HPagination";
import { TIPO_DOCUMENTO_INCLUDE } from '../../../includes/TipoDocumentoInclude';
import { CARGO_INCLUDE } from '../../../includes/CargoInclude'
// import { TipoDocumento } from "../../models/TipoDocumento";

class PersonaRepository {
    /**
     * Obtiene todas las personas
     * @returns {Promise<PersonaResponse>}
     */
    async getAll(): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                attributes: PERSONA_ATTRIBUTES,
                // include: [DETALLE_PARAMETRO_INCLUDE],
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: personas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas las personas por estado
     * @param {boolean} estado - El estado de las personas a buscar
     * @returns {Promise<PersonaResponse>}>} Respuesta con la lista de personas filtrados
     */
    async getAllByEstado(estado: boolean): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                where: {
                    estado
                },
                attributes: PERSONA_ATTRIBUTES,
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: personas, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene todas las personas por estado
     * @param {string} idEmpresa - El ID de la empresa a buscar
     * @returns {Promise<PersonaResponse>}>} Respuesta con la lista de personas filtrados
     */
    async getAllByEmpresa(idEmpresa: string): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                where: {
                    id_empresa: idEmpresa
                },
                attributes: PERSONA_ATTRIBUTES,
                order: [
                    ['apellido_paterno', 'ASC']
                ]
            })

            return { result: true, data: personas, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByEmpresaWithGrupo(
        idEmpresa: string,
        nombreGrupo: string
    ): Promise<PersonaResponse> {
        try {
            const queryData = `
                SELECT dp2.abreviatura, e.nombre_o_razon_social, dp3.nombre as nombre_cargo, p.*
                FROM persona p INNER JOIN grupo_persona gp ON gp.id_persona  = p.id
                INNER JOIN detalle_parametro dp on dp.id = gp.id_grupo
                INNER JOIN detalle_parametro dp2 on dp2.id = p.id_tipodocumento
                INNER JOIN detalle_parametro dp3 on dp3.id = p.id_cargo
                INNER JOIN empresa e on e.id = p.id_empresa
                WHERE dp.nombre = :nombreGrupo
                AND p.id_empresa = :idEmpresa
                ORDER BY p.apellido_paterno ASC;
            `

            const rows = await sequelize.query(queryData, {
                replacements: { nombreGrupo, idEmpresa },
                type: 'SELECT',
                model: Persona,
                mapToModel: true
            });

            return { result: true, data: rows, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getUniqueByEmpresaWithGrupo(
        idEmpresa: string,
        nombreGrupo: string
    ): Promise<PersonaResponse> {
        try {
            const queryData = `
                SELECT dp2.abreviatura, e.nombre_o_razon_social, dp3.nombre as nombre_cargo, p.*
                FROM persona p INNER JOIN grupo_persona gp ON gp.id_persona  = p.id
                INNER JOIN detalle_parametro dp on dp.id = gp.id_grupo
                INNER JOIN detalle_parametro dp2 on dp2.id = p.id_tipodocumento
                INNER JOIN detalle_parametro dp3 on dp3.id = p.id_cargo
                INNER JOIN empresa e on e.id = p.id_empresa
                WHERE dp.nombre = :nombreGrupo
                AND p.id_empresa = :idEmpresa
                LIMIT 1;
            `

            const rows = await sequelize.query(queryData, {
                replacements: { nombreGrupo, idEmpresa },
                type: 'SELECT',
                model: Persona,
                mapToModel: true
            })

            return { result: true, data: rows, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllByGrupoWithPaginate(
        page: number,
        limit: number,
        filters: any
    ): Promise<PersonaResponsePaginate> {
        try {
            const offset = HPagination.getOffset(page, limit);
            const { nombreGrupo, id_empresa, numero_documento, id_tipodocumento, nombre_completo } = filters;

            // 1. Condiciones base obligatorias
            const conditions = ["dp.nombre = :nombreGrupo"];
            const replacements: any = { nombreGrupo, limit, offset };

            // 2. Condiciones dinámicas (opcionales)
            if (id_empresa) {
                conditions.push("p.id_empresa = :id_empresa");
                replacements.id_empresa = id_empresa;
            }

            if (id_tipodocumento) {
                conditions.push("p.id_tipodocumento = :id_tipodocumento");
                replacements.id_tipodocumento = id_tipodocumento;
            }

            if (numero_documento) {
                conditions.push("LOWER(p.numero_documento) = LOWER(:numero_documento)");
                replacements.numero_documento = numero_documento;
            }

            if (nombre_completo) {
                // Buscamos coincidencia en cualquier parte del nombre completo
                conditions.push("LOWER(p.nombre_completo) LIKE LOWER(:nombre_completo)");
                replacements.nombre_completo = `%${nombre_completo}%`;
            }

            const whereClause = `WHERE ${conditions.join(" AND ")}`;

            const baseQuery = `
                FROM persona p 
                INNER JOIN grupo_persona gp ON gp.id_persona = p.id
                INNER JOIN detalle_parametro dp ON dp.id = gp.id_grupo
                INNER JOIN detalle_parametro dp2 ON dp2.id = p.id_tipodocumento
                INNER JOIN detalle_parametro dp3 ON dp3.id = p.id_cargo
                INNER JOIN empresa e ON e.id = p.id_empresa
                ${whereClause}
            `;

            const queryData = `
                SELECT dp2.abreviatura, e.nombre_o_razon_social, dp3.nombre as nombre_cargo, p.*
                ${baseQuery}
                ORDER BY e.nombre_o_razon_social ASC, p.apellido_paterno ASC
                LIMIT :limit OFFSET :offset;
            `;

            // const queryData = `
            //     SELECT dp2.abreviatura, e.nombre_o_razon_social, dp3.nombre as nombre_cargo, p.*
            //     FROM persona p INNER JOIN grupo_persona gp ON gp.id_persona  = p.id
            //     INNER JOIN detalle_parametro dp on dp.id = gp.id_grupo
            //     INNER JOIN detalle_parametro dp2 on dp2.id = p.id_tipodocumento
            //     INNER JOIN detalle_parametro dp3 on dp3.id = p.id_cargo
            //     INNER JOIN empresa e on e.id = p.id_empresa
            //     WHERE dp.nombre = :nombreGrupo
            //     ORDER BY p.apellido_paterno ASC
            //     LIMIT :limit OFFSET :offset;
            // `

            // const queryCount = `
            //     SELECT COUNT(p.id) as total
            //     FROM persona p
            //     INNER JOIN grupo_persona gp ON gp.id_persona = p.id
            //     INNER JOIN detalle_parametro dp ON dp.id = gp.id_grupo
            //     WHERE dp.nombre = :nombreGrupo
            // `

            // const queryCount = `
            //     SELECT COUNT(p.id) as total
            //     FROM persona p INNER JOIN grupo_persona gp ON gp.id_persona  = p.id
            //     INNER JOIN detalle_parametro dp on dp.id = gp.id_grupo
            //     INNER JOIN detalle_parametro dp2 on dp2.id = p.id_tipodocumento
            //     INNER JOIN detalle_parametro dp3 on dp3.id = p.id_cargo
            //     INNER JOIN empresa e on e.id = p.id_empresa
            //     WHERE dp.nombre = :nombreGrupo
            // `

            const queryCount = `SELECT COUNT(p.id) as total ${baseQuery}`;

            const rows = await sequelize.query(queryData, {
                replacements,
                type: 'SELECT',
                model: Persona,
                mapToModel: true
            });

            const [countResult]: any = await sequelize.query(queryCount, {
                replacements,
                type: 'SELECT'
            })

            const total = parseInt(countResult.total);
            const totalPages = Math.ceil(total / limit)
            const nextPage = HPagination.getNextPage(page, limit, total)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IPersonaPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: total,
                nextPage,
                previousPage
            }

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            }

            // const { count, rows } = await Persona.findAndCountAll({
            //     attributes: PERSONA_ATTRIBUTES,
            //     include: [
            //         {
            //             model: DetalleParametro,
            //             as: 'grupos', // Mismo alias definido en setupDatabase
            //             where: {
            //                 nombre: nombreGrupo // Filtro: 'GRUPO TRABAJADOR SOCIAL'
            //             },
            //             attributes: [], // No traemos columnas de la tabla de grupos
            //             through: {
            //                 attributes: [] // No traemos columnas de la tabla intermedia
            //             },
            //             required: true // Fuerza el INNER JOIN
            //         }
            //     ],
            //     subQuery: false,
            //     distinct: true,
            //     col: 'id',
            //     order: [
            //         ['apellido_paterno', 'ASC']
            //     ],
            //     limit,
            //     offset
            // })

            // const totalPages = Math.ceil(count / limit)
            // const nextPage = HPagination.getNextPage(page, limit, count)
            // const previousPage = HPagination.getPreviousPage(page)

            // const pagination: IPersonaPaginate = {
            //     currentPage: page,
            //     limit,
            //     totalPages,
            //     totalItems: total,
            //     nextPage,
            //     previousPage
            // }

            // return {
            //     result: true,
            //     data: rows,
            //     pagination,
            //     status: 200
            // }

            // return { result: true, data: personas, status: 200 }
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene una persona por su ID
     * @param {string} id - El ID UUID de la persona a buscar
     * @returns {Promise<PersonaResponse>} Respuesta con la persona encontrada o mensaje de no encontrado
     */
    // async getById(id: string): Promise<PersonaResponse> {
    //     try {

    //     } catch (error) {
    //         const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    //         return { result: false, error: errorMessage, status: 500 }
    //     }
    // }

    async getById(id: string): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id, {
                attributes: PERSONA_ATTRIBUTES,
                // include: [DETALLE_PARAMETRO_INCLUDE]
            })

            console.log('---- getById PersonaRepository ----')
            console.log({ persona })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 404 }
            }

            return { result: true, data: persona, message: 'Persona encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Obtiene una persona por su tipo y número de documento
     * @param {string} idTipoDoc - El ID del tipo de documento 
     * @param {string} numDoc - El número de documento 
     * @returns {Promise<PersonaResponse>}
     */
    async getByIdTipoDocAndNumDoc(idTipoDoc: string, numDoc: string): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findOne({
                where: {
                    id_tipodocumento: idTipoDoc,
                    numero_documento: numDoc
                },
                attributes: PERSONA_ATTRIBUTES,
                include: [
                    DETALLE_PARAMETRO_INCLUDE,
                    TIPO_DOCUMENTO_INCLUDE,
                    CARGO_INCLUDE
                ]
            })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 404 }
            }

            return { result: true, data: persona, message: 'Persona encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea una persona
     * @param {IPersona} data - Los datos de la persona a crear 
     * @returns {Promise<PersonaResponse>} Respuesta con la persona creada o error
     */
    async create(data: IPersona): Promise<PersonaResponse> {

        // Accede a la instancia de Sequelize a través de db.sequelize
        // const transaction = await sequelize.transaction()

        try {
            const { numero_documento } = data

            // Verificar si el número de documento existe en otra persona
            const existingPersona = await Persona.findOne({
                where: {
                    numero_documento
                }
            })

            if (existingPersona) {
                return { result: false, message: 'El número de documento ya existe', status: 409 }
            }

            const newPersona = await Persona.create(data as IPersona)

            // await transaction.commit()

            const { id } = newPersona

            if (id) {
                return { result: true, message: 'Persona registrada con éxito', data: newPersona, status: 200 }
            }

            return { result: false, error: 'Error al registrar la persona', data: [], status: 500 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza una persona existente por su ID
     * @param {string} id - El ID de la persona a actualizar 
     * @param {IPersona} data - Los nuevos datos de la persona 
     * @returns {Promise<PersonaResponse>} Respuesta con la persona actualizada o error
     */
    async update(id: string, data: IPersona): Promise<PersonaResponse> {

        // Accede a la instancia de Sequelize a travé de db.sequelize
        // const transaction = await sequelize.transaction()

        try {
            const { numero_documento } = data

            // const persona = await Persona.findByPk(id, { transaction })
            const persona = await Persona.findByPk(id)

            if (!persona) {
                // await transaction.rollback();
                return { result: false, data: [], message: 'Persona no encontrada', status: 404 }
            }

            if (numero_documento) {
                // Verificar si el número de documento existe en otra persona
                const existingPersona = await Persona.findOne({
                    where: {
                        numero_documento,
                        id: {
                            [Op.ne]: id
                        }
                    }
                })

                if (existingPersona) {
                    // await transaction.rollback()
                    return { result: false, message: 'El número de documento ya existe', status: 409 }
                }
            }

            const dataUpdatePersona: Partial<IPersona> = data

            // const updatedPersona = await persona.update(dataUpdatePersona, { transaction })
            const updatedPersona = await persona.update(dataUpdatePersona)

            // await transaction.commit()

            return { result: true, message: 'Persona actualizada con éxito', data: updatedPersona, status: 200 }
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Actualiza el estado de una persona
     * @param {string} id - El ID UUID de la persona 
     * @param {boolean} estado - El nuevo estado de la persona 
     * @returns {Promise<PersonaResponse>} Respuesta con la persona actualizada
     */
    async updateEstado(id: string, estado: boolean): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id)

            if (!persona) {
                return { result: false, message: 'Persona no encontrada', status: 404 }
            }

            persona.estado = estado
            await persona.save()

            return { result: true, message: 'Estado actualizado con éxito', data: persona, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Elimina (lógicamente) una persona con su ID
     * @param {string} id - El ID de la persona a eliminar 
     * @returns {Promise<PersonaResponse>} Respuesta de la eliminación
     */
    async delete(id: string): Promise<PersonaResponse> {
        // Inicia la transacción
        const transaction = await sequelize.transaction()

        try {
            // const persona = await Persona.findByPk(id, { transaction });
            const persona = await Persona.findByPk(id);

            if (!persona) {
                // await transaction.rollback()
                return { result: false, data: [], message: 'Persona no encontrada', status: 404 };
            }

            // await persona.destroy({ transaction });
            await persona.destroy();

            // await transaction.commit()

            return { result: true, data: persona, message: 'Persona eliminada correctamente', status: 200 };
        } catch (error) {
            // await transaction.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

// export default new PersonaRepository()

export default PersonaRepository