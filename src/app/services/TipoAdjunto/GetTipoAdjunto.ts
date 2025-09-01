import TipoAdjuntoRepository from "../../repositories/TipoAdjunto/TipoAdjuntoRepository";
import { TipoAdjuntoResponse } from '../../interfaces/TipoAdjunto/ITipoAdjunto';

/**
 * @class GetTipoAdjuntoService
 * @description Servicio para obtener un solo tipo de adjunto por ID
 */
class GetTipoAdjuntoService {
    /**
     * Ejecuta la operación para obtener un tipo de adjunto por ID
     * @param {string} id - El ID UUID del tipo de adjunto a buscar
     * @returns {Promise<TipoAdjuntoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<TipoAdjuntoResponse> {
        return await TipoAdjuntoRepository.getById(id)
    }
}

export default new GetTipoAdjuntoService()