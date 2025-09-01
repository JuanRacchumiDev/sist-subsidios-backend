import CobroRepository from '../../repositories/Cobro/CobroRepository';
import { ICobro, CobroResponse } from '../../interfaces/Cobro/ICobro';

/**
 * @class CreateCobroService
 * @description Servicio para crear un nuevo cobro.
 */
class CreateCobroService {
    /**
     * Ejecuta la operación para crear un cobro.
     * @param {ICobro} data - Los datos del cobro a crear.
     * @returns {Promise<CobroResponse>} La respuesta de la operación.
     */
    async execute(data: ICobro): Promise<CobroResponse> {
        return await CobroRepository.create(data);
    }
}

export default new CreateCobroService();