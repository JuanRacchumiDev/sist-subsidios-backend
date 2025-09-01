import DocumentoRepository from '../../repositories/Documento/DocumentoRepository';
import { DocumentoResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class DeleteDocumentoService
 * @description Servicio para eliminar (soft delete) un documento.
 */
class DeleteDocumentoService {
    /**
     * Ejecuta la operación de eliminación para un documento.
     * @param {string} id - El ID UUID del documento a eliminar.
     * @returns {Promise<DocumentoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<DocumentoResponse> {
        return await DocumentoRepository.delete(id);
    }
}

export default new DeleteDocumentoService();