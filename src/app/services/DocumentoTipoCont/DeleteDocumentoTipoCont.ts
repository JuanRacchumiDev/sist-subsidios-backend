import DocumentoTipoContRepository from '../../repositories/DocumentoTipoCont/DocumentoTipoContRepository';
import { DocumentoTipoContResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class DeleteDocumentoTipoContService
 * @description Servicio para eliminar (soft delete) un documento.
 */
class DeleteDocumentoTipoContService {
    protected documentoTipoContRepository: DocumentoTipoContRepository

    constructor() {
        this.documentoTipoContRepository = new DocumentoTipoContRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un documento.
     * @param {string} id - El ID UUID del documento a eliminar.
     * @returns {Promise<DocumentoTipoContResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<DocumentoTipoContResponse> {
        return await this.documentoTipoContRepository.delete(id);
    }
}

export default new DeleteDocumentoTipoContService();