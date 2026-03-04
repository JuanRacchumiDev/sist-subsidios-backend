import AdjuntoRepository from '../../repositories/Adjunto/AdjuntoRepository';
import { IAdjunto, AdjuntoResponse } from '../../interfaces/Adjunto/IAdjunto';

/**
 * @class CreateAdjuntoService
 * @description Servicio para crear un nuevo adjunto.
 */
class CreateAdjuntoService {
    private adjuntoRepository: AdjuntoRepository

    constructor() {
        this.adjuntoRepository = new AdjuntoRepository()
    }
    /**
     * Ejecuta la operación para crear un adjunto.
     * @param {IAdjunto} data - Los datos del adjunto a crear.
     * @returns {Promise<AdjuntoResponse>} La respuesta de la operación.
     */
    async execute(data: IAdjunto): Promise<AdjuntoResponse> {
        console.log('---- CreateAdjunto - createAdjuntoService ----')
        console.log({ data })
        return await this.adjuntoRepository.create(data);
    }
}

export default new CreateAdjuntoService();