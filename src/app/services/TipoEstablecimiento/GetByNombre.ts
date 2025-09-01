import TipoEstablecimientoRepository from '../../repositories/TipoEstablecimiento/TipoEstablecimientoRepository';
import { TipoEstablecimientoResponse } from '../../interfaces/TipoEstablecimiento/ITipoEstablecimiento';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un tipo de establecimiento por su nombre.
 */
class GetByNombreService {
    /**
     * Ejecuta la operación para obtener un tipo de establecimiento por nombre.
     * @param {string} nombre - El nombre del establecimiento a buscar
     * @returns {Promise<TipoEstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<TipoEstablecimientoResponse> {
        return await TipoEstablecimientoRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();