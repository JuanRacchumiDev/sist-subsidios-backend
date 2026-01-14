import DetalleRepository from "../../repositories/DetalleParametro/DetalleParametroRepository";
import { DetalleParametroResponse } from "../../interfaces/DetalleParametro/IDetalleParametro";

/**
 * @class GetByNombreUrlService
 * @description Servicio para obtener detalle por nombre_url
 */
class GetByNombreUrlService {
    protected detalleRepository: DetalleRepository

    constructor() {
        this.detalleRepository = new DetalleRepository()
    }

    /**
     * 
     * @param {string} nombreUrl - El nombre_url de un detalle
     * @returns {Promise<DetalleParametroResponse>} La respuesta de la operación
     */
    async execute(nombreUrl: string): Promise<DetalleParametroResponse> {
        return await this.detalleRepository.getByNombreUrl(nombreUrl)
    }
}

export default new GetByNombreUrlService()