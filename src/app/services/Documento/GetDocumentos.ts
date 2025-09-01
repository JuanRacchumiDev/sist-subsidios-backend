import DocumentoRepository from "../../repositories/Documento/DocumentoRepository";
import { DocumentoTipoContResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class GetDocumentosService
 * @description Servicio para obtener todos los documentos, opcionalmente filtrados por estado
 */
class GetDocumentosService {
    /**
     * Ejecuta la operación para obtener documentos
     * @param {boolean | undefined} estado - Opcional. Filtra los documentos por su estado
     * @returns {Promise<DocumentoTipoContResponse>} La respuesta de obtener los documentos
     */
    async execute(estado?: boolean): Promise<DocumentoTipoContResponse> {
        // if (typeof estado === 'boolean') {
        //     return await DocumentoRepository.getal(estado)
        // }
        return await DocumentoRepository.getAll()
    }
}

export default new GetDocumentosService()