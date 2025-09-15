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
     * @param {boolean | undefined} estado - Opcional. Filtra los adjuntos por su estado
     * @returns {Promise<AdjuntoResponse>} La respuesta de obtener los adjuntos
     */
    async execute(estado?: boolean): Promise<AdjuntoResponse> {
        // if (typeof estado === 'boolean') {
        //     return await AdjuntoRepository.getAllByEstado(estado)
        // }
        return await this.adjuntoRepository.getAll()
    }
}

export default new GetAdjuntosService()