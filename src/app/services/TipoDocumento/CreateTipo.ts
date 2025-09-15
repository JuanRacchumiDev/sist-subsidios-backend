import TipoDocumentoRepository from '../../repositories/TipoDocumento/TipoDocumentoRepository';
import { ITipoDocumento, TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';

/**
 * @class CreateTipoService
 * @description Servicio para crear un nuevo tipo de documento.
 */
class CreateTipoService {
    protected tipoDocumentoRepository: TipoDocumentoRepository

    constructor() {
        this.tipoDocumentoRepository = new TipoDocumentoRepository()
    }

    /**
     * Ejecuta la operación para crear un tipo de documento.
     * @param {ITipoDocumento} data - Los datos del tipo de documento a crear.
     * @returns {Promise<TipoDocumentoResponse>} La respuesta de la operación.
     */
    async execute(data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        return await this.tipoDocumentoRepository.create(data);
    }
}

export default new CreateTipoService();