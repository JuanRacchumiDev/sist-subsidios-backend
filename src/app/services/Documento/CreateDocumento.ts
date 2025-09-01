import DocumentoRepository from '../../repositories/Documento/DocumentoRepository';
import { IDocumento, DocumentoResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class CreateDocumentoService
 * @description Servicio para crear un nuevo documento.
 */
class CreateDocumentoService {
    /**
     * Ejecuta la operación para crear un documento.
     * @param {IDocumento} data - Los datos del documento a crear.
     * @returns {Promise<DocumentoResponse>} La respuesta de la operación.
     */
    async execute(data: IDocumento): Promise<DocumentoResponse> {
        return await DocumentoRepository.create(data);
    }
}

export default new CreateDocumentoService();