import ConfiguracionRepository from "../../repositories/Configuracion/ConfiguracionRepository";
import { ConfiguracionResponsePaginate } from '../../interfaces/Configuracion/IConfiguracion';

/**
 * @class GetConfiguracionesPaginateService
 * @description Servicio para obtener todas las configuraciones con paginación, opcionalmente filtrados por estado
 */
class GetConfiguracionesPaginateService {
    private configuracionRepository: ConfiguracionRepository

    constructor() {
        this.configuracionRepository = new ConfiguracionRepository()
    }

    /**
     * Ejecuta la operación para obtener configuraciones paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<ConfiguracionResponsePaginate>} La respuesta de obtener las configuraciones
     */
    async execute(page: number, limit: number): Promise<ConfiguracionResponsePaginate> {
        return await this.configuracionRepository.getAllPaginate(page, limit)
    }
}

export default new GetConfiguracionesPaginateService()