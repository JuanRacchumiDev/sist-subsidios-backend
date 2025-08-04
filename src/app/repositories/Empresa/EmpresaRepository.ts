import axios from "axios";
import sequelize from '../../../config/database'
import { API_RUC } from "../../../helpers/HApi";
import { IEmpresa, EmpresaResponse } from "../../interfaces/Empresa/IEmpresa"
import { Empresa } from "../../models/Empresa"

const EMPRESA_ATTRIBUTES = [
    'id',
    'numero',
    'nombre_o_razon_social',
    'tipo_contribuyente',
    'estado_sunat',
    'condicion_sunat',
    'departamento',
    'provincia',
    'distrito',
    'direccion',
    'direccion_completa',
    'ubigeo_sunat',
    'estado'
]

class EmpresaRepository {
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

                const {
                    result: createdEmpresaResult,
                    data: createdEmpresaData,
                    message: createdEmpresaMessage,
                    error: createdEmpresaError,
                    status: createdEmpresaStatus
                } = await this.create(empresaToCreate)

                if (createdEmpresaResult) {
                    return {
                        result: createdEmpresaResult,
                        data: createdEmpresaData,
                        message: createdEmpresaMessage,
                        status: createdEmpresaStatus
                    }
                }

                return {
                    result: createdEmpresaResult,
                    error: createdEmpresaError,
                    status: createdEmpresaStatus
                }
            }

            return {
                result: false,
                message: "Error al obtener datos de la empresa",
                data: [],
                status
            }
        } catch (error) {
            // console.log('error', error)
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            // console.log('errorMessage getInfo API', errorMessage)

            if (errorMessage === 'Request failed with status code 404') {
                const message = `No se encontró información con el RUC: ${ruc}`
                return { result: false, message, status: 404 }
            } else {
                return { result: false, error: errorMessage, status: 500 }
            }
        }
    }

    /**
         * Obtiene todas las personas
         * @returns {Promise<EmpresaResponse>}
         */
    async getAll(): Promise<EmpresaResponse> {
        try {
            const empresas = await Empresa.findAll({
                attributes: EMPRESA_ATTRIBUTES,
                order: [
                    ['nombre_o_razon_social', 'ASC']
                ]
            })

            return { result: true, data: empresas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    /**
     * Crea una empresa
     * @param {IEmpresa} data - Los datos de la empresa a crear
     * @returns {Promise<EmpresaResponse>} Respuesta con la empresa creada o error
     */
    async create(data: IEmpresa): Promise<EmpresaResponse> {
        const t = await sequelize.transaction()

        try {
            const newEmpresa = await Empresa.create(data)

            await t.commit()

            if (newEmpresa.id) {
                return { result: true, message: 'Empresa registrada con éxito', data: newEmpresa, status: 200 }
            }

            return { result: false, error: 'Error al registrar la empresa', data: [], status: 500 }
        } catch (error) {
            await t.rollback()
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default new EmpresaRepository()