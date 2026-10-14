import ConfiguracionRepository from '../../repositories/Configuracion/ConfiguracionRepository';
import { IConfiguracion, ConfiguracionResponse } from '../../interfaces/Configuracion/IConfiguracion';

/**
 * @class UpdateConfiguracionService
 * @description Servicio para crear una nueva configuración.
 */
class UpdateConfiguracionService {
    private configuracionRepository: ConfiguracionRepository

    constructor() {
        this.configuracionRepository = new ConfiguracionRepository()
    }

    /**
     * Ejecuta la operación para actualizar una configuración.
     * @param {string} id - El ID UUID de la configuración a actualizar.
     * @param {IConfiguracion} data - Los datos parciales o completos de la configuración a actualizar.
     * @returns {Promise<ConfiguracionResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IConfiguracion): Promise<ConfiguracionResponse> {
        return await this.configuracionRepository.update(id, data);
    }
}

export default new UpdateConfiguracionService();