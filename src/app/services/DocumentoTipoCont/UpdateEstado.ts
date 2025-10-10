import DocumentoTipoContRepository from '../../repositories/DocumentoTipoCont/DocumentoTipoContRepository';
import { IDocumentoTipoCont, DocumentoTipoContResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class UpdateEstadoService
 * @description Servicio para actualizar el documento de un tipo de contingencia.
 */
class UpdateEstadoService {
    protected documentoTipoContRepository: DocumentoTipoContRepository

    constructor() {
        this.documentoTipoContRepository = new DocumentoTipoContRepository()
    }

    /**
     * Ejecuta la operación para actualizar el documento de un tipo de contingencia.
     * @param {string} id - El ID UUID del documento del tipo de contingencia a actualizar.
     * @param {IDocumentoTipoCont} data - Los datos parciales o completos del documento del tipo de contingencia a actualizar.
     * @returns {Promise<DocumentoTipoContResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IDocumentoTipoCont): Promise<DocumentoTipoContResponse> {
        const { estado } = data
        return await this.documentoTipoContRepository.updateEstado(id, estado as boolean);
    }
}

export default new UpdateEstadoService();