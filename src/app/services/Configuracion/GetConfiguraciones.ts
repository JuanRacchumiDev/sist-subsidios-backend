import ConfiguracionRepository from "../../repositories/Configuracion/ConfiguracionRepository";
import { ConfiguracionResponse } from '../../interfaces/Configuracion/IConfiguracion';

/**
 * @class GetConfiguracionesService
 * @description Servicio para obtener todas las configuraciones
 */
class GetConfiguracionesService {
    private configuracionRepository: ConfiguracionRepository

    constructor() {
        this.configuracionRepository = new ConfiguracionRepository()
    }

    /**
     * Ejecuta la operación para obtener configuraciones
     * @returns {Promise<ConfiguracionResponse>} La respuesta de obtener las configuraciones
     */
    async execute(): Promise<ConfiguracionResponse> {
        return await this.configuracionRepository.getAll()
    }
}

export default new GetConfiguracionesService()