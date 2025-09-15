import EstablecimientoRepository from '../../repositories/Establecimiento/EstablecimientoRepository';
import { IEstablecimiento, EstablecimientoResponse } from '../../interfaces/Establecimiento/IEstablecimiento';

/**
 * @class CreateEstablecimientoService
 * @description Servicio para crear un establecimiento
 */
class CreateEstablecimientoService {
    protected establecimientoRepository: EstablecimientoRepository

    constructor() {
        this.establecimientoRepository = new EstablecimientoRepository()
    }

    /**
     * Ejecuta la operación para crear un establecimiento.
     * @param {IEstablecimiento} data - Los datos del establecimiento a crear.
     * @returns {Promise<EstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(data: IEstablecimiento): Promise<EstablecimientoResponse> {
        return await this.establecimientoRepository.create(data);
    }
}

export default new CreateEstablecimientoService();