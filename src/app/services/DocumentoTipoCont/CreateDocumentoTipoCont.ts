import DocumentoTipoContRepository from '../../repositories/DocumentoTipoCont/DocumentoTipoContRepository';
import { IDocumentoTipoCont, DocumentoTipoContResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class CreateDocumentoTipoContService
 * @description Servicio para crear un nuevo documento.
 */
class CreateDocumentoTipoContService {
    protected documentoTipoContRepository: DocumentoTipoContRepository

    constructor() {
        this.documentoTipoContRepository = new DocumentoTipoContRepository()
    }

    /**
     * Ejecuta la operación para crear un documento.
     * @param {IDocumentoTipoCont} data - Los datos del documento a crear.
     * @returns {Promise<DocumentoTipoContResponse>} La respuesta de la operación.
     */
    async execute(data: IDocumentoTipoCont): Promise<DocumentoTipoContResponse> {
        return await this.documentoTipoContRepository.create(data);
    }
}

export default new CreateDocumentoTipoContService();