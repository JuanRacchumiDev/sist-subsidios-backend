import { ConfiguracionResponse, ConfiguracionResponsePaginate, IConfiguracion, IConfiguracionPaginate } from "@/interfaces/Configuracion/IConfiguracion";
import { Configuracion } from "../../models/Configuracion";
import { CONFIGURACION_ATTRIBUTES } from "../../../constants/ConfiguracionConstant";
import HPagination from '../../../helpers/HPagination';
import HString from '../../../helpers/HString'

class ConfiguracionRepository {
    /**
     * Obtiene todas las configuraciones
     */
    async getAll(): Promise<ConfiguracionResponse> {
        try {
            const configuraciones = await Configuracion.findAll({
                attributes: CONFIGURACION_ATTRIBUTES,
                order: [
                    ['created_at', 'DESC']
                ]
            })

            return { result: true, data: configuraciones, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getAllPaginate(page: number, limit: number, estado?: boolean): Promise<ConfiguracionResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereClause = typeof estado === 'boolean' ? { estado } : {}

            const { count, rows } = await Configuracion.findAndCountAll({
                attributes: CONFIGURACION_ATTRIBUTES,
                where: whereClause,
                order: [
                    ['created_at', 'ASC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IConfiguracionPaginate = {
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

    async getByCriterio(criterio: string): Promise<ConfiguracionResponse> {
        try {
            const configuraciones = await Configuracion.findAll({
                where: {
                    criterio,
                    estado: true
                },
                attributes: CONFIGURACION_ATTRIBUTES,
                order: [
                    ['created_at', 'DESC']
                ]
            })

            return { result: true, data: configuraciones, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByClave(clave: string): Promise<ConfiguracionResponse> {
        try {
            const configuracion = await Configuracion.findOne({
                where: {
                    clave
                },
                attributes: CONFIGURACION_ATTRIBUTES
            })

            if (!configuracion) {
                return { result: false, data: [], message: 'Configuración no encontrada', status: 404 }
            }

            return { result: true, data: configuracion, message: 'Configuración encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: string): Promise<ConfiguracionResponse> {
        try {
            const configuracion = await Configuracion.findByPk(id, {
                attributes: CONFIGURACION_ATTRIBUTES
            })

            if (!configuracion) {
                return { result: false, data: [], message: 'Configuración no encontrada', status: 404 }
            }

            return { result: true, data: configuracion, message: 'Configuración encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getEmailConfiguration(): Promise<{ host: string, port: number, user: string, pass: string, fromAddress: string, fromName: string }> {
        try {
            const response = await this.getByCriterio('EMAIL');
            const { result, data } = response
            const configs = result && Array.isArray(data) ? data : []

            const configMap: Record<string, string> = {}

            configs.forEach((item: any) => {
                const { clave, valor } = item
                let newValor: string = valor

                if (clave === 'EMAIL_PASSWORD' && valor) {
                    try {
                        newValor = HString.decrypt(valor)
                    } catch (e) {
                        console.error('[ConfiguracionRepository] Error al descifrar la contraseña del correo:', e);
                    }
                }
                configMap[clave] = newValor
            })

            return {
                host: configMap['EMAIL_HOST'] || process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
                port: Number(configMap['EMAIL_PORT']) || Number(process.env.MAIL_PORT) || 2525,
                user: configMap['EMAIL_USER'] || process.env.MAIL_USER || '',
                pass: configMap['EMAIL_PASSWORD'] || process.env.MAIL_PASS || '',
                fromAddress: configMap['EMAIL_FROM_ADDRESS'] || process.env.MAIL_FROM_ADDRESS || 'noreply@tuapp.com',
                fromName: configMap['EMAIL_FROM_NAME'] || process.env.MAIL_FROM_NAME || 'Sistema'
            };

        } catch (error) {
            console.error('[ConfiguracionRepository] Error obteniendo configuraciones de email, usando fallback de entorno:', error);
            return {
                host: process.env.MAIL_HOST || 'sandbox.smtp.mailtrap.io',
                port: Number(process.env.MAIL_PORT) || 2525,
                user: process.env.MAIL_USER || '',
                pass: process.env.MAIL_PASS || '',
                fromAddress: process.env.MAIL_FROM_ADDRESS || 'noreply@tuapp.com',
                fromName: process.env.MAIL_FROM_NAME || 'Sistema'
            };
        }
    }

    async create(data: IConfiguracion): Promise<ConfiguracionResponse> {
        try {
            console.log({ data })

            const { clave, valor } = data

            if (clave === 'EMAIL_PASSWORD' && valor) {
                data.valor = HString.encrypt(valor as string)
            }

            const newConfiguracion = await Configuracion.create(data)

            console.log({ newConfiguracion })

            if (newConfiguracion && newConfiguracion.id) {
                return {
                    result: true,
                    message: 'Configuración registrada con éxito',
                    data: newConfiguracion,
                    status: 200,
                    error: ''
                }
            }

            return { result: false, message: 'Error al registrar la configuración', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return {
                result: false,
                message: 'No se pudo crear la configuración',
                error: errorMessage,
                status: 500,
            }
        }
    }

    async update(id: string, data: IConfiguracion): Promise<ConfiguracionResponse> {
        try {
            const configuracion = await Configuracion.findByPk(id)

            if (!configuracion) {
                return { result: false, message: 'Configuración no encontrada', status: 404 }
            }

            // Validar si están intentando cambiar la clave y si esta ya existe en otro registro
            const nuevaClave = data.clave;
            if (nuevaClave && nuevaClave !== configuracion.clave) {
                const existingConfiguracion = await Configuracion.findOne({
                    where: { clave: nuevaClave }
                })

                if (existingConfiguracion) {
                    return { result: false, message: 'La configuración por actualizar ya existe', status: 409 }
                }
            }

            // Si se está actualizando la contraseña del correo, debemos cifrarla antes de guardar
            if (data.clave === 'EMAIL_PASSWORD' && data.valor) {
                data.valor = HString.encrypt(data.valor as string);
            } else if (!data.clave && configuracion.clave === 'EMAIL_PASSWORD' && data.valor) {
                // Caso donde no mandan la clave explícitamente en el DTO de update pero el registro actual es EMAIL_PASSWORD
                data.valor = HString.encrypt(data.valor as string);
            }

            const updateConfiguracion = await configuracion.update(data)

            return { result: true, message: 'Configuración actualizada con éxito', data: updateConfiguracion, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }
}

export default ConfiguracionRepository