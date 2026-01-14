import DetalleRepository from "../../repositories/DetalleParametro/DetalleParametroRepository";
import { DetalleParametroResponse } from '../../interfaces/DetalleParametro/IDetalleParametro';

/**
 * @class GetDetalleService
 * @description Servicio para obtener un solo detalle por ID
 */
class GetDetalleService {
    private detalleRepository: DetalleRepository

    constructor() {
        this.detalleRepository = new DetalleRepository()
    }

    /**
     * Ejecuta la operación para obtener un detalle por ID
     * @param {string} id - El ID UUID del detalle a buscar
     * @returns {Promise<DetalleParametroResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<DetalleParametroResponse> {
        return await this.detalleRepository.getById(id)
    }
}

export default new GetDetalleService()