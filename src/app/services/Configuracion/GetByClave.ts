import ConfiguracionRepository from '../../repositories/Configuracion/ConfiguracionRepository';
import { ConfiguracionResponse } from '../../interfaces/Configuracion/IConfiguracion';

/**
 * @class GetByClaveService
 * @description Servicio para obtener una configuración por clave.
 */
class GetByClaveService {
    protected configuracionRepository: ConfiguracionRepository

    constructor() {
        this.configuracionRepository = new ConfiguracionRepository()
    }

    /**
     * Ejecuta la operación para obtener una configuración por clave.
     * @param {string} clave - La clave de la configuración a buscar.
     * @returns {Promise<ConfiguracionResponse>} La respuesta de la operación.
     */
    async execute(clave: string): Promise<ConfiguracionResponse> {
        return await this.configuracionRepository.getByClave(clave);
    }
}

export default new GetByClaveService();