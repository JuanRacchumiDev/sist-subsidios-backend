import PaisRepository from '../../repositories/Pais/PaisRepository';
import { IPais, PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class CreatePaisService
 * @description Servicio para crear un nuevo país.
 */
class CreatePaisService {
    /**
     * Ejecuta la operación para crear un país.
     * @param {IPais} data - Los datos del país a crear.
     * @returns {Promise<PaisResponse>} La respuesta de la operación.
     */
    async execute(data: IPais): Promise<PaisResponse> {
        return await PaisRepository.create(data);
    }
}

export default new CreatePaisService();