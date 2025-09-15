import TipoEstablecimientoRepository from '../../repositories/TipoEstablecimiento/TipoEstablecimientoRepository';
import { TipoEstablecimientoResponse } from '../../interfaces/TipoEstablecimiento/ITipoEstablecimiento';

/**
 * @class DeleteTipoService
 * @description Servicio para eliminar (soft delete) un tipo de establecimiento.
 */
class DeleteTipoService {
    protected tipoEstablecimientoRepository: TipoEstablecimientoRepository

    constructor() {
        this.tipoEstablecimientoRepository = new TipoEstablecimientoRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un tipo de establecimiento.
     * @param {string} id - El ID UUID del tipo de establecimiento a eliminar.
     * @returns {Promise<TipoEstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<TipoEstablecimientoResponse> {
        return await this.tipoEstablecimientoRepository.delete(id);
    }
}

export default new DeleteTipoService();