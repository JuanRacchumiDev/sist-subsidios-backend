import TipoEstablecimientoRepository from '../../repositories/TipoEstablecimiento/TipoEstablecimientoRepository';
import { ITipoEstablecimiento, TipoEstablecimientoResponse } from '../../interfaces/TipoEstablecimiento/ITipoEstablecimiento';

/**
 * @class CreateTipoService
 * @description Servicio para crear un nuevo tipo de establecimiento.
 */
class CreateTipoService {
    /**
     * Ejecuta la operación para crear un tipo de establecimiento.
     * @param {ITipoEstablecimiento} data - Los datos del tipo de establecimiento a crear.
     * @returns {Promise<TipoEstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(data: ITipoEstablecimiento): Promise<TipoEstablecimientoResponse> {
        return await TipoEstablecimientoRepository.create(data);
    }
}

export default new CreateTipoService();