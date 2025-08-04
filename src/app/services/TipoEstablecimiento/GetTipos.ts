import TipoEstablecimientoRepository from "../../repositories/TipoEstablecimiento/TipoEstablecimientoRepository";
import { TipoEstablecimientoResponse } from '../../interfaces/TipoEstablecimiento/ITipoEstablecimiento';

/**
 * @class GetTiposService
 * @description Servicio para obtener todos los tipo de establecimientos, opcionalmente filtrados por estado
 */
class GetTiposService {
    /**
     * Ejecuta la operación para obtener tipo de establecimientos
     * @param {boolean | undefined} estado - Opcional. Filtra los tipo de establecimientos por su estado
     * @returns {Promise<TipoEstablecimientoResponse>} La respuesta de obtener los tipo de establecimientos
     */
    async execute(estado?: boolean): Promise<TipoEstablecimientoResponse> {
        if (typeof estado === 'boolean') {
            return await TipoEstablecimientoRepository.getAllByEstado(estado)
        }
        return await TipoEstablecimientoRepository.getAll()
    }
}

export default new GetTiposService()