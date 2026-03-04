import AdjuntoRepository from '../../repositories/Adjunto/AdjuntoRepository';
import { IAdjunto, AdjuntoResponse } from '../../interfaces/Adjunto/IAdjunto';

class UpdateAdjuntoByParamsService {
    private adjuntoRepository: AdjuntoRepository

    constructor() {
        this.adjuntoRepository = new AdjuntoRepository()
    }

    /**
     * Ejecuta la operación para actualizar un adjunto
     * @param {IAdjunto} data - Los datos parciales o completos del adjunto a actualizar 
     * @returns {Promise<AdjuntoResponse>} La respuesta de la operación
     */
    async execute(data: IAdjunto): Promise<AdjuntoResponse> {
        return await this.adjuntoRepository.updateByParams(data);
    }
}

export default new UpdateAdjuntoByParamsService()