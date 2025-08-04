import TipoContingenciaRepository from "../../repositories/TipoContingencia/TipoContingenciaRepository";
import { TipoContingenciaResponse } from '../../interfaces/TipoContingencia/ITipoContingencia';

/**
 * @class GetTipoService
 * @description Servicio para obtener un solo tipo de contingencia por ID
 */
class GetTipoService {
    /**
     * Ejecuta la operación para obtener un tipo de contingencia por ID
     * @param {string} id - El ID UUID del tipo de contingencia a buscar
     * @returns {Promise<TipoContingenciaResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<TipoContingenciaResponse> {
        return await TipoContingenciaRepository.getById(id)
    }
}

export default new GetTipoService()