import DocumentoTipoContRepository from "../../repositories/DocumentoTipoCont/DocumentoTipoContRepository";
import { DocumentoTipoContResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class GetDocumentoTipoContService
 * @description Servicio para obtener un solo documento por ID
 */
class GetDocumentoTipoContService {
    /**
     * Ejecuta la operación para obtener un documento por ID
     * @param {string} id - El ID UUID del documento a buscar
     * @returns {Promise<DocumentoTipoContResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<DocumentoTipoContResponse> {
        return await DocumentoTipoContRepository.getById(id)
    }
}

export default new GetDocumentoTipoContService()