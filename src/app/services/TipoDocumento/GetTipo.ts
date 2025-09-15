import TipoDocumentoRepository from "../../repositories/TipoDocumento/TipoDocumentoRepository";
import { TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';

/**
 * @class GetTipoService
 * @description Servicio para obtener un solo tipo de documento por ID
 */
class GetTipoService {
    protected tipoDocumentoRepository: TipoDocumentoRepository

    constructor() {
        this.tipoDocumentoRepository = new TipoDocumentoRepository()
    }

    /**
     * Ejecuta la operación para obtener un tipo de documento por ID
     * @param {string} id - El ID UUID del tipo de documento a buscar
     * @returns {Promise<TipoDocumentoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<TipoDocumentoResponse> {
        return await this.tipoDocumentoRepository.getById(id)
    }
}

export default new GetTipoService()