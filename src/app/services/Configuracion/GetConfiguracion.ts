import ConfiguracionRepository from "../../repositories/Configuracion/ConfiguracionRepository";
import { ConfiguracionResponse } from '../../interfaces/Configuracion/IConfiguracion';

/**
 * @class GetConfiguracionService
 * @description Servicio para obtener una configuración por ID
 */
class GetConfiguracionService {
    private configuracionRepository: ConfiguracionRepository

    constructor() {
        this.configuracionRepository = new ConfiguracionRepository()
    }
    /**
     * Ejecuta la operación para obtener una configuración por ID
     * @param {string} id - El ID UUID de la configuración a buscar
     * @returns {Promise<ConfiguracionResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<ConfiguracionResponse> {
        return await this.configuracionRepository.getById(id)
    }
}

export default new GetConfiguracionService()