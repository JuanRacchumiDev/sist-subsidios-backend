import axios from "axios"
import { API_RUC } from "../../../helpers/HApi"
import { EmpresaResponse, IEmpresa } from "../../interfaces/Empresa/IEmpresa"
import EmpresaRepository from './EmpresaRepository'

class EmpresaApiRepository {
    private empresaRepository: EmpresaRepository

    constructor() {
        this.empresaRepository = new EmpresaRepository()
    }

    /**
     * Obtiene una empresa por su RUC
     * @param {string} ruc - El ruc de la empresa a buscar
     * @returns {Promise<EmpresaResponse>} Respuesta con la empresa encontrada o mensaje de no encontrado 
     */
    async getInfoApi(ruc: string): Promise<EmpresaResponse> {
        try {
            const urlApi = `${API_RUC}${ruc}`

            const { env } = process
            const { TOKEN_API_DOCS } = env

            const response = await axios.get(`${urlApi}`, {
                headers: {
                    Authorization: `Bearer ${TOKEN_API_DOCS}`
                }
            })

            const { status, data: apiData } = response

            if (status === 200) {
                console.log({ status })
                console.log(apiData.data)
                const {
                    numero,
                    nombre_o_razon_social,
                    tipo_contribuyente,
                    estado,
                    condicion,
                    departamento,
                    provincia,
                    distrito,
                    direccion,
                    direccion_completa,
                    ubigeo_sunat
                } = apiData.data

                const empresaToCreate: IEmpresa = {
                    numero,
                    nombre_o_razon_social,
                    tipo_contribuyente,
                    estado_sunat: estado,
                    condicion_sunat: condicion,
                    departamento,
                    provincia,
                    distrito,
                    direccion,
                    direccion_completa,
                    ubigeo_sunat,
                    sistema: true
                }

                console.log({ empresaToCreate })

                const {
                    result: createdEmpresaResult,
                    data: createdEmpresaData,
                    message: createdEmpresaMessage,
                    error: createdEmpresaError,
                    status: createdEmpresaStatus
                } = await this.empresaRepository.create(empresaToCreate)

                console.log({ createdEmpresaResult })
                console.log({ createdEmpresaData })
                console.log({ createdEmpresaMessage })
                console.log({ createdEmpresaError })
                console.log({ createdEmpresaStatus })

                if (createdEmpresaResult) {
                    return {
                        result: createdEmpresaResult,
                        error: '',
                        message: createdEmpresaMessage,
                        data: createdEmpresaData,
                        status: createdEmpresaStatus
                    }
                }

                return {
                    result: createdEmpresaResult,
                    error: createdEmpresaError,
                    message: createdEmpresaMessage,
                    data: createdEmpresaData,
                    status: createdEmpresaStatus,
                }
            }

            console.log('---- error crear empresa ----')

            return {
                result: false,
                error: '',
                message: "Error al obtener datos de la empresa",
                data: [],
                status
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

            if (errorMessage === 'Request failed with status code 404') {
                const message = `No se encontró información con el RUC: ${ruc}`
                return {
                    result: false,
                    error: '',
                    message,
                    data: [],
                    status: 404
                }
            } else {
                return {
                    result: false,
                    error: errorMessage,
                    message: '',
                    data: [],
                    status: 500
                }
            }
        }
    }
}

// export default new EmpresaApiRepository()

export default EmpresaApiRepository