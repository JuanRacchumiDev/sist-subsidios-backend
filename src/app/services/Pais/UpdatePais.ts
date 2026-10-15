import PaisRepository from '../../repositories/Pais/PaisRepository';
import { IPais, PaisResponse } from '../../interfaces/Pais/IPais';

/**
 * @class UpdatePaisService
 * @description Servicio para actualizar un país existente, incluyendo el cambio de estado.
 */
class UpdatePaisService {
    protected paisRepository: PaisRepository

    constructor() {
        this.paisRepository = new PaisRepository()
    }

    /**
     * Ejecuta la operación para actualizar un país.
     * Puede actualizar cualquier campo definido en IPais, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del país a actualizar.
     * @param {IPais} data - Los datos parciales o completos del país a actualizar.
     * @returns {Promise<PaisResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IPais): Promise<PaisResponse> {
        return await this.paisRepository.update(id, data);
    }
}

export default new UpdatePaisService();