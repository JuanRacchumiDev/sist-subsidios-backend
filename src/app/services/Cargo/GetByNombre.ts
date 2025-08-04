import CargoRepository from '../../repositories/Cargo/CargoRepository';
import { CargoResponse } from '../../interfaces/Cargo/ICargo';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un cargo por su nombre.
 */
class GetByNombreService {
    /**
     * Ejecuta la operación para obtener un cargo por nombre.
     * @param {string} nombre - El nombre del cargo a buscar.
     * @returns {Promise<CargoResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<CargoResponse> {
        return await CargoRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();