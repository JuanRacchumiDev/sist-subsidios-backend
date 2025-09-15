import EstablecimientoRepository from '../../repositories/Establecimiento/EstablecimientoRepository';
import { EstablecimientoResponse } from '../../interfaces/Establecimiento/IEstablecimiento';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un establecimiento por su nombre.
 */
class GetByNombreService {
    protected establecimientoRepository: EstablecimientoRepository

    constructor() {
        this.establecimientoRepository = new EstablecimientoRepository()
    }

    /**
     * Ejecuta la operación para obtener un establecimiento por nombre.
     * @param {string} nombre - El nombre del establecimiento a buscar.
     * @returns {Promise<EstablecimientoResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<EstablecimientoResponse> {
        return await this.establecimientoRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();