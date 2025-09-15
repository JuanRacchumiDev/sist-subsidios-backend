import PaisRepository from '../../repositories/Pais/PaisRepository';
import { PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un país por su nombre.
 */
class GetByNombreService {
    protected paisRepository: PaisRepository

    constructor() {
        this.paisRepository = new PaisRepository()
    }

    /**
     * Ejecuta la operación para obtener un país por nombre.
     * @param {string} nombre - El nombre del país a buscar.
     * @returns {Promise<PaisResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<PaisResponse> {
        return await this.paisRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();