import EstablecimientoRepository from '../../repositories/Establecimiento/EstablecimientoRepository';
import { EstablecimientoResponse } from '../../interfaces/Establecimiento/IEstablecimiento';

/**
 * @class DeleteEstablecimientoService
 * @description Servicio para eliminar (soft delete) un establecimiento.
 */
class DeleteEstablecimientoService {
    /**
     * Ejecuta la operación de eliminación para un establecimiento.
     * @param {string} id - El ID UUID del establecimiento a eliminar.
     * @returns {Promise<EstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<EstablecimientoResponse> {
        return await EstablecimientoRepository.delete(id);
    }
}

export default new DeleteEstablecimientoService();