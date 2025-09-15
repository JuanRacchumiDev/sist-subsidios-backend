import TipoAdjuntoRepository from '../../repositories/TipoAdjunto/TipoAdjuntoRepository';
import { ITipoAdjunto, TipoAdjuntoResponse } from '../../interfaces/TipoAdjunto/ITipoAdjunto';

/**
 * @class CreateTipoAdjuntoService
 * @description Servicio para crear un nuevo tipo de adjunto.
 */
class CreateTipoAdjuntoService {
    protected tipoAdjuntoRepository: TipoAdjuntoRepository

    constructor() {
        this.tipoAdjuntoRepository = new TipoAdjuntoRepository()
    }

    /**
     * Ejecuta la operación para crear un tipo de adjunto.
     * @param {ITipoAdjunto} data - Los datos del tipo de adjunto a crear.
     * @returns {Promise<TipoAdjuntoResponse>} La respuesta de la operación.
     */
    async execute(data: ITipoAdjunto): Promise<TipoAdjuntoResponse> {
        return await this.tipoAdjuntoRepository.create(data);
    }
}

export default new CreateTipoAdjuntoService();