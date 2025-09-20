import DocumentoTipoContRepository from "../../repositories/DocumentoTipoCont/DocumentoTipoContRepository";
import { DocumentoTipoContResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class GetDocumentosTipoContService
 * @description Servicio para obtener todos los documentos, opcionalmente filtrados por estado
 */
class GetDocumentosTipoContService {
    protected documentoTipoContRepository: DocumentoTipoContRepository

    constructor() {
        this.documentoTipoContRepository = new DocumentoTipoContRepository()
    }

    /**
     * Ejecuta la operación para obtener documentos
     * @returns {Promise<DocumentoTipoContResponse>} La respuesta de obtener los documentos
     */
    async execute(): Promise<DocumentoTipoContResponse> {
        return await this.documentoTipoContRepository.getAll()
    }
}

export default new GetDocumentosTipoContService()