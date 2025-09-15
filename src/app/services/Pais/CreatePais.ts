import PaisRepository from '../../repositories/Pais/PaisRepository';
import { IPais, PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class CreatePaisService
 * @description Servicio para crear un nuevo país.
 */
class CreatePaisService {
    protected paisRepository: PaisRepository

    constructor() {
        this.paisRepository = new PaisRepository()
    }

    /**
     * Ejecuta la operación para crear un país.
     * @param {IPais} data - Los datos del país a crear.
     * @returns {Promise<PaisResponse>} La respuesta de la operación.
     */
    async execute(data: IPais): Promise<PaisResponse> {
        return await this.paisRepository.create(data);
    }
}

export default new CreatePaisService();