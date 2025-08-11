import axios from 'axios';
import sequelize from '../../../config/database'
import { API_DNI, API_CEE } from '../../../helpers/HApi';
import { IPersona, PersonaResponse } from "../../interfaces/Persona/IPersona";
import { Persona } from "../../models/Persona";
import { TipoDocumento } from "../../models/TipoDocumento";
import { EOrigen } from '../../enums/EOrigen';
import TipoDocumentoRepository from '../TipoDocumento/TipoDocumentoRepository';
import { ITipoDocumento } from '../../interfaces/TipoDocumento/ITipoDocumento';

const PERSONA_ATTRIBUTES = [
    'id',
    'id_tipodocumento',
    'numero_documento',
    'nombres',
    'apellido_paterno',
    'apellido_materno',
    'nombre_completo',
    'departamento',
    'provincia',
    'distrito',
    'direccion',
    'direccion_completa',
    'ubigeo_reniec',
    'ubigeo_sunat',
    'ubigeo',
    'fecha_nacimiento',
    'estado_civil',
    'foto',
    'sexo',
    'origen',
    'estado'
]

const TIPO_DOCUMENTO_INCLUDE = {
    model: TipoDocumento,
    as: 'tipoDocumento',
    attributes: ['id', 'nombre', 'abreviatura']
}

class PersonaRepository {
    /**
     * Obtiene una persona por su ID
     * @param {string} abreviatura - La abreviatura del tipo de documento
     * @param {string} numeroDocumento - El número de documento de la persona a buscar
     * @returns {Promise<PersonaResponse>} Respuesta con la persona encontrada/creada o mensaje de error
     */
    async getInfoApi(abreviatura: string, numeroDocumento: string): Promise<PersonaResponse> {
        try {
            const urlApi = (abreviatura === 'DNI') ? `${API_DNI}${numeroDocumento}` : `${API_CEE}${numeroDocumento}`
            const { env } = process
            const { TOKEN_API_DOCS } = env

            const response = await axios.get(`${urlApi}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN_API_DOCS}`
                }
            })

            const { status, data: apiData } = response

            if (status === 200) {
                const {
                    numero,
                    nombres,
                    apellido_paterno,
                    apellido_materno,
                    nombre_completo,
                    departamento,
                    provincia,
                    distrito,
                    direccion,
                    direccion_completa,
                    ubigeo_reniec,
                    ubigeo_sunat,
                    fecha_nacimiento,
                    estado_civil,
                    sexo
                } = apiData.data

                const {
                    result: tipoDocResult,
                    data: dataTipoDocumento,
                    message: tipoDocMessage,
                    status: tipoDocStatus
                } = await TipoDocumentoRepository.getByAbreviatura(abreviatura)

                if (!tipoDocResult && !dataTipoDocumento) {
                    return {
                        result: tipoDocResult,
                        message: tipoDocMessage,
                        status: tipoDocStatus
                    }
                }

                const { id: idTipoDocumento } = dataTipoDocumento as ITipoDocumento

                // const dataTipoDocumento = responseTipoDocumento.data as ITipoDocumento

                const personaToCreate: IPersona = {
                    id_tipodocumento: idTipoDocumento,
                    numero_documento: numero,
                    nombres,
                    apellido_paterno,
                    apellido_materno,
                    nombre_completo,
                    departamento,
                    provincia,
                    distrito,
                    direccion,
                    direccion_completa,
                    ubigeo_reniec,
                    ubigeo_sunat,
                    fecha_nacimiento,
                    estado_civil,
                    sexo,
                    origen: EOrigen.API,
                    sistema: true,
                    estado: true
                }

                const {
                    result: createdPersonaResult,
                    data: createdPersonaData,
                    message: createdPersonaMessage,
                    error: createdPersonaError,
                    status: createdPersonaStatus
                } = await this.create(personaToCreate)

                if (createdPersonaResult) {
                    return {
                        result: createdPersonaResult,
                        data: createdPersonaData,
                        message: createdPersonaMessage,
                        status: createdPersonaStatus
                    }
                }

                return {
                    result: createdPersonaResult,
                    error: createdPersonaError,
                    status: createdPersonaStatus
                }
            }

            return {
                result: false,
                message: "Error al obtener datos de la persona",
                data: [],
                status
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

            if (errorMessage === 'Request failed with status code 404') {
                const message = `No se encontró información con el número de documento: ${numeroDocumento}`
                return { result: false, message, status: 404 }
            } else {
                return { result: false, error: errorMessage, status: 500 }
            }
        }
    }

    /**
     * Obtiene todas las personas
     * @returns {Promise<PersonaResponse>}
     */
    async getAll(): Promise<PersonaResponse> {
        try {
            const personas = await Persona.findAll({
                attributes: PERSONA_ATTRIBUTES,
                include: [TIPO_DOCUMENTO_INCLUDE],
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
     * Obtiene una persona por su ID
     * @param {string} id - El ID UUID de la persona a buscar
     * @returns {Promise<PersonaResponse>} Respuesta con la persona encontrada o mensaje de no encontrado
     */
    async getById(id: string): Promise<PersonaResponse> {
        try {
            const persona = await Persona.findByPk(id, {
                attributes: PERSONA_ATTRIBUTES,
                include: [TIPO_DOCUMENTO_INCLUDE],
                order: [
                    ['apellido_paterno', 'ASC']
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
                include: [TIPO_DOCUMENTO_INCLUDE]
            })

            if (!persona) {
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 }
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
        const t = await sequelize.transaction()

        try {
            const newPersona = await Persona.create(data as any)

            await t.commit()

            if (newPersona.id) {
                return { result: true, message: 'Persona registrada con éxito', data: newPersona, status: 200 }
            }

            return { result: false, error: 'Error al registrar la persona', data: [], status: 500 }
        } catch (error) {
            await t.rollback()
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
        const t = await sequelize.transaction()

        try {
            const persona = await Persona.findByPk(id, { transaction: t })

            if (!persona) {
                await t.rollback();
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 }
            }

            const dataUpdatePersona: Partial<IPersona> = data

            const updatedPersona = await persona.update(dataUpdatePersona, { transaction: t })

            await t.commit()

            return { result: true, message: 'Persona actualizada con éxito', data: updatedPersona, status: 200 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
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
        const t = await sequelize.transaction()

        try {
            const persona = await Persona.findByPk(id, { transaction: t });

            if (!persona) {
                await t.rollback()
                return { result: false, data: [], message: 'Persona no encontrada', status: 200 };
            }

            await persona.destroy({ transaction: t });

            await t.commit()

            return { result: true, data: persona, message: 'Persona eliminada correctamente', status: 200 };
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new PersonaRepository()