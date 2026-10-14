import ConfiguracionRepository from '../../repositories/Configuracion/ConfiguracionRepository';
import { IConfiguracion, ConfiguracionResponse } from '../../interfaces/Configuracion/IConfiguracion';

/**
 * @class CreateConfiguracionService
 * @description Servicio para crear una nueva configuración.
 */
class CreateConfiguracionService {
    private configuracionRepository: ConfiguracionRepository

    constructor() {
        this.configuracionRepository = new ConfiguracionRepository()
    }

    /**
     * Ejecuta la operación para crear una configuración.
     * @param {IConfiguracion} data - Los datos de la configuración a crear.
     * @returns {Promise<ConfiguracionResponse>} La respuesta de la operación.
     */
    async execute(data: IConfiguracion): Promise<ConfiguracionResponse> {
        return await this.configuracionRepository.create(data);
    }
}

export default new CreateConfiguracionService();