import TipoContingenciaRepository from '../../repositories/TipoContingencia/TipoContingenciaRepository';
import { ITipoContingencia, TipoContingenciaResponse } from '../../interfaces/TipoContingencia/ITipoContingencia';

/**
 * @class CreateTipoService
 * @description Servicio para crear un nuevo tipo de contingencia.
 */
class CreateTipoService {
    /**
     * Ejecuta la operación para crear un tipo de contingencia.
     * @param {ITipoContingencia} data - Los datos del tipo de contingencia a crear.
     * @returns {Promise<TipoContingenciaResponse>} La respuesta de la operación.
     */
    async execute(data: ITipoContingencia): Promise<TipoContingenciaResponse> {
        return await TipoContingenciaRepository.create(data);
    }
}

export default new CreateTipoService();