import AdjuntoRepository from "../../repositories/Adjunto/AdjuntoRepository";
import { AdjuntoResponse } from '../../interfaces/Adjunto/IAdjunto';

/**
 * @class GetAdjuntosService
 * @description Servicio para obtener todos los adjuntos, opcionalmente filtrados por estado
 */
class GetAdjuntosService {
    private adjuntoRepository: AdjuntoRepository

    constructor() {
        this.adjuntoRepository = new AdjuntoRepository()
    }
    /**
     * Ejecuta la operación para obtener adjuntos
     * @returns {Promise<AdjuntoResponse>} La respuesta de obtener los adjuntos
     */
    async execute(): Promise<AdjuntoResponse> {
        return await this.adjuntoRepository.getAll()
    }
}

export default new GetAdjuntosService()