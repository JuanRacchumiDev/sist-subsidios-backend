import TipoDocumentoRepository from '../../repositories/TipoDocumento/TipoDocumentoRepository';
import { TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';

/**
 * @class DeleteTipoService
 * @description Servicio para eliminar (soft delete) un tipo de documento.
 */
class DeleteTipoService {
    protected tipoDocumentoRepository: TipoDocumentoRepository

    constructor() {
        this.tipoDocumentoRepository = new TipoDocumentoRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un tipo de documento.
     * @param {string} id - El ID UUID del tipo de documento a eliminar.
     * @returns {Promise<TipoDocumentoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<TipoDocumentoResponse> {
        return await this.tipoDocumentoRepository.delete(id);
    }
}

export default new DeleteTipoService();