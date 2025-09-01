import EstablecimientoRepository from '../../repositories/Establecimiento/EstablecimientoRepository';
import { IEstablecimiento, EstablecimientoResponse } from '../../interfaces/Establecimiento/IEstablecimiento';

/**
 * @class UpdateEstablecimientoService
 * @description Servicio para actualizar un establecimiento existente, incluyendo el cambio de estado.
 */
class UpdateEstablecimientoService {
    /**
     * Ejecuta la operación para actualizar un establecimiento.
     * Puede actualizar cualquier campo definido en IEstablecimiento, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del establecimiento a actualizar.
     * @param {IEstablecimiento} data - Los datos parciales o completos del establecimiento a actualizar.
     * @returns {Promise<EstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IEstablecimiento): Promise<EstablecimientoResponse> {
        return await EstablecimientoRepository.update(id, data);
    }
}

export default new UpdateEstablecimientoService();