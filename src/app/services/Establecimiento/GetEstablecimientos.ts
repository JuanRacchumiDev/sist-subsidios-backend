import EstablecimientoRepository from "../../repositories/Establecimiento/EstablecimientoRepository";
import { EstablecimientoResponse } from '../../interfaces/Establecimiento/IEstablecimiento';

/**
 * @class GetEstablecimientosService
 * @description Servicio para obtener todos los establecimientos, opcionalmente filtrados por estado
 */
class GetEstablecimientosService {
    /**
     * Ejecuta la operación para obtener establecimientos
     * @returns {Promise<EstablecimientoResponse>} La respuesta de obtener los establecimientos
     */
    async execute(): Promise<EstablecimientoResponse> {
        return await EstablecimientoRepository.getAll()
    }
}

export default new GetEstablecimientosService()