import axios from 'axios';
import { API_DNI, API_CEE } from '../../../helpers/HApi';
import TipoDocumentoRepository from '../TipoDocumento/TipoDocumentoRepository';
import HDate from '../../../helpers/HDate';
import { IPersona, PersonaResponse } from '../../interfaces/Persona/IPersona';
import { ITipoDocumento } from '../../interfaces/TipoDocumento/ITipoDocumento';
import PersonaRepository from '../Persona/PersonaRepository'
import { EOrigen } from '../../enums/EOrigen';

class PersonaApiRepository {
    /**
     * Obtiene una persona por su ID
     * @param {string} abreviatura - La abreviatura del tipo de documento
     * @param {string} numeroDocumento - El número de documento de la persona a buscar
     * @returns {Promise<PersonaResponse>} Respuesta con la persona encontrada/creada o mensaje de error
     */
    async getInfoApi(abreviatura: string, numeroDocumento: string): Promise<PersonaResponse> {
        try {
            // Verificando si existe tipo de documento
            const {
                result: tipoDocResult,
                data: dataTipoDocumento,
                message: tipoDocMessage,
                status: tipoDocStatus
            } = await TipoDocumentoRepository.getBySearch({ abreviatura })

            if (!tipoDocResult && !dataTipoDocumento) {
                return {
                    result: tipoDocResult,
                    message: tipoDocMessage,
                    status: tipoDocStatus
                }
            }

            const { id: idTipoDocumento } = dataTipoDocumento as ITipoDocumento

            // Definiendo la url de consulta a la API
            const urlApi = (abreviatura === 'DNI')
                ? `${API_DNI}${numeroDocumento}`
                : `${API_CEE}${numeroDocumento}`

            const { env } = process

            const { TOKEN_API_DOCS } = env

            const response = await axios.get(`${urlApi}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN_API_DOCS}`
                }
            })

            const { status, data: apiData } = response

            if (status === 200) {
                const { data } = apiData

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
                } = data

                const fechaNacimientoFormatted = HDate.validateAndFormatDate(fecha_nacimiento)
                    ? HDate.validateAndFormatDate(fecha_nacimiento) as string
                    : '1990-01-01'

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
                    fecha_nacimiento: fechaNacimientoFormatted,
                    estado_civil,
                    sexo: sexo || "M",
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
                } = await PersonaRepository.create(personaToCreate)

                if (!createdPersonaResult) {
                    return {
                        result: createdPersonaResult,
                        error: createdPersonaError,
                        status: createdPersonaStatus
                    }

                }

                return {
                    result: createdPersonaResult,
                    data: createdPersonaData,
                    message: createdPersonaMessage,
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
}

export default new PersonaApiRepository()