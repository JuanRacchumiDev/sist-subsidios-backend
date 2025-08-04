import TipoDocumentoRepository from '../../repositories/TipoDocumento/TipoDocumentoRepository';
import { ITipoDocumento, TipoDocumentoResponse } from '../../interfaces/TipoDocumento/ITipoDocumento';

/**
 * @class UpdateTipoService
 * @description Servicio para actualizar un tipo de documento existente, incluyendo el cambio de estado.
 */
class UpdateTipoService {
    /**
     * Ejecuta la operación para actualizar un tipo de documento.
     * Puede actualizar cualquier campo definido en ITipoDocumento, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del tipo de documento a actualizar.
     * @param {ITipoDocumento} data - Los datos parciales o completos del tipo de documento a actualizar.
     * @returns {Promise<TipoDocumentoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: ITipoDocumento): Promise<TipoDocumentoResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
            return await TipoDocumentoRepository.updateEstado(id, data.estado);
        }
        return await TipoDocumentoRepository.update(id, data);
    }
}

export default new UpdateTipoService();