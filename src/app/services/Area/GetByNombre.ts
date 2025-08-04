import AreaRepository from '../../repositories/Area/AreaRepository';
import { AreaResponse } from '../../interfaces/Area/IArea';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un área por su nombre.
 */
class GetByNombreService {
    /**
     * Ejecuta la operación para obtener un área por nombre.
     * @param {string} nombre - El nombre del área a buscar.
     * @returns {Promise<AreaResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<AreaResponse> {
        return await AreaRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();