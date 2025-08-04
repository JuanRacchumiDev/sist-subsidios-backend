import PaisRepository from '../../repositories/Pais/PaisRepository';
import { PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un país por su nombre.
 */
class GetByNombreService {
    /**
     * Ejecuta la operación para obtener un país por nombre.
     * @param {string} nombre - El nombre del país a buscar.
     * @returns {Promise<PaisResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<PaisResponse> {
        return await PaisRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();