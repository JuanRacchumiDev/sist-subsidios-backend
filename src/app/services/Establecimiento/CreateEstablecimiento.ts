import EstablecimientoRepository from '../../repositories/Establecimiento/EstablecimientoRepository';
import { IEstablecimiento, EstablecimientoResponse } from '../../interfaces/Establecimiento/IEstablecimiento';

/**
 * @class CreateEstablecimientoService
 * @description Servicio para crear un establecimiento
 */
class CreateEstablecimientoService {
    /**
     * Ejecuta la operación para crear un establecimiento.
     * @param {IEstablecimiento} data - Los datos del establecimiento a crear.
     * @returns {Promise<EstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(data: IEstablecimiento): Promise<EstablecimientoResponse> {
        return await EstablecimientoRepository.create(data);
    }
}

export default new CreateEstablecimientoService();