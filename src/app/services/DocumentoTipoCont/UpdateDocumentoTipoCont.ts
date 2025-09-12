import DocumentoTipoContRepository from '../../repositories/DocumentoTipoCont/DocumentoTipoContRepository';
import { IDocumentoTipoCont, DocumentoTipoContResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class UpdateDocumentoTipoContService
 * @description Servicio para actualizar un documento existente, incluyendo el cambio de estado.
 */
class UpdateDocumentoTipoContService {
    /**
     * Ejecuta la operación para actualizar un documento.
     * Puede actualizar cualquier campo definido en IDocumentoTipoCont, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del documento a actualizar.
     * @param {IDocumentIDocumentoTipoConto} data - Los datos parciales o completos del documento a actualizar.
     * @returns {Promise<DocumentoTipoContResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IDocumentoTipoCont): Promise<DocumentoTipoContResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        // if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
        //     return await DocumentoTipoContRepository.updateEstado(id, data.estado);
        // }
        return await DocumentoTipoContRepository.update(id, data);
    }
}

export default new UpdateDocumentoTipoContService();