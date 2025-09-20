import TipoEstablecimientoRepository from "../../repositories/TipoEstablecimiento/TipoEstablecimientoRepository";
import { TipoEstablecimientoResponse } from '../../interfaces/TipoEstablecimiento/ITipoEstablecimiento';

/**
 * @class GetTiposService
 * @description Servicio para obtener todos los tipo de establecimientos, opcionalmente filtrados por estado
 */
class GetTiposService {
    protected tipoEstablecimientoRepository: TipoEstablecimientoRepository

    constructor() {
        this.tipoEstablecimientoRepository = new TipoEstablecimientoRepository()
    }

    /**
     * Ejecuta la operación para obtener tipo de establecimientos
     * @returns {Promise<TipoEstablecimientoResponse>} La respuesta de obtener los tipo de establecimientos
     */
    async execute(): Promise<TipoEstablecimientoResponse> {
        return await this.tipoEstablecimientoRepository.getAll()
    }
}

export default new GetTiposService()