import DetalleParametroRepository from "../../repositories/DetalleParametro/DetalleParametroRepository";
import { DetalleParametroResponse } from '../../interfaces/DetalleParametro/IDetalleParametro';

/**
 * @class GetDetallesService
 * @description Servicio para obtener todos los detalles, opcionalmente filtrados por estado
 */
class GetDetallesService {
    private detalleParametroRepository: DetalleParametroRepository

    constructor() {
        this.detalleParametroRepository = new DetalleParametroRepository()
    }

    /**
     * Ejecuta la operación para obtener detalles
     * @returns {Promise<DetalleParametroResponse>} La respuesta de obtener los detalles
     */
    async execute(clase: number, estado: boolean): Promise<DetalleParametroResponse> {
        return await this.detalleParametroRepository.getAll(clase, estado)
    }
}

export default new GetDetallesService()