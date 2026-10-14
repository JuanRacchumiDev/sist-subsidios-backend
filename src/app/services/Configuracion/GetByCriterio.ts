import ConfiguracionRepository from '../../repositories/Configuracion/ConfiguracionRepository';
import { ConfiguracionResponse } from '../../interfaces/Configuracion/IConfiguracion';

/**
 * @class GetByCriterioService
 * @description Servicio para obtener una configuración por criterio.
 */
class GetByCriterioService {
    protected configuracionRepository: ConfiguracionRepository

    constructor() {
        this.configuracionRepository = new ConfiguracionRepository()
    }

    /**
     * Ejecuta la operación para obtener una configuración por criterio.
     * @param {string} criterio - El criterio de la configuración a buscar.
     * @returns {Promise<ConfiguracionResponse>} La respuesta de la operación.
     */
    async execute(criterio: string): Promise<ConfiguracionResponse> {
        return await this.configuracionRepository.getByCriterio(criterio);
    }
}

export default new GetByCriterioService();