import DetalleRepository from '../../repositories/DetalleParametro/DetalleParametroRepository';
import { IDetalleParametro, DetalleParametroResponse } from '../../interfaces/DetalleParametro/IDetalleParametro';

/**
 * @class CreateDetalleService
 * @description Servicio para crear un nuevo detalle.
 */
class CreateDetalleService {
    private detalleRepository: DetalleRepository

    constructor() {
        this.detalleRepository = new DetalleRepository()
    }

    /**
     * Ejecuta la operación para crear un detalle.
     * @param {IDetalleParametro} data - Los datos del detalle a crear.
     * @returns {Promise<DetalleParametroResponse>} La respuesta de la operación.
     */
    async execute(data: IDetalleParametro): Promise<DetalleParametroResponse> {
        return await this.detalleRepository.create(data);
    }
}

export default new CreateDetalleService();