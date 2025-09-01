import CobroRepository from "../../repositories/Cobro/CobroRepository";
import { CobroResponse } from '../../interfaces/Cobro/ICobro';

/**
 * @class GetCobrosService
 * @description Servicio para obtener todos los cobros, opcionalmente filtrados por estado
 */
class GetCobrosService {
    /**
     * Ejecuta la operación para obtener cobros
     * @param {boolean | undefined} estado - Opcional. Filtra los cobros por su estado
     * @returns {Promise<CobroResponse>} La respuesta de obtener los cobros
     */
    async execute(estado?: boolean): Promise<CobroResponse> {
        if (typeof estado === 'boolean') {
            return await CobroRepository.getAllByEstado(estado)
        }
        return await CobroRepository.getAll()
    }
}

export default new GetCobrosService()