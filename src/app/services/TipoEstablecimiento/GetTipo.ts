import TipoEstablecimientoRepository from "../../repositories/TipoEstablecimiento/TipoEstablecimientoRepository";
import { TipoEstablecimientoResponse } from '../../interfaces/TipoEstablecimiento/ITipoEstablecimiento';

/**
 * @class GetTipoService
 * @description Servicio para obtener un solo tipo de establecimiento por ID
 */
class GetTipoService {
    protected tipoEstablecimientoRepository: TipoEstablecimientoRepository

    constructor() {
        this.tipoEstablecimientoRepository = new TipoEstablecimientoRepository()
    }

    /**
     * Ejecuta la operación para obtener un tipo de establecimiento por ID
     * @param {string} id - El ID UUID del tipo de establecimiento a buscar
     * @returns {Promise<TipoEstablecimientoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<TipoEstablecimientoResponse> {
        return await this.tipoEstablecimientoRepository.getById(id)
    }
}

export default new GetTipoService()