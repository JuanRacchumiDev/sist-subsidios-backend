import DocumentoRepository from "../../repositories/Documento/DocumentoRepository";
import { DocumentoResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class GetDocumentoService
 * @description Servicio para obtener un solo documento por ID
 */
class GetDocumentoService {
    /**
     * Ejecuta la operación para obtener un documento por ID
     * @param {string} id - El ID UUID del documento a buscar
     * @returns {Promise<DocumentoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<DocumentoResponse> {
        return await DocumentoRepository.getById(id)
    }
}

export default new GetDocumentoService()