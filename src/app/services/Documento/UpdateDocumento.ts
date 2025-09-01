import DocumentoRepository from '../../repositories/Documento/DocumentoRepository';
import { IDocumento, DocumentoResponse } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class UpdateDocumentoService
 * @description Servicio para actualizar un documento existente, incluyendo el cambio de estado.
 */
class UpdateDocumentoService {
    /**
     * Ejecuta la operación para actualizar un documento.
     * Puede actualizar cualquier campo definido en IDocumento, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del documento a actualizar.
     * @param {IDocumento} data - Los datos parciales o completos del documento a actualizar.
     * @returns {Promise<DocumentoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IDocumento): Promise<DocumentoResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        // if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
        //     return await DocumentoRepository.updateEstado(id, data.estado);
        // }
        return await DocumentoRepository.update(id, data);
    }
}

export default new UpdateDocumentoService();