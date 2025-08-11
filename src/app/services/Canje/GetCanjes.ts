import CanjeRepository from "../../repositories/Canje/CanjeRepository";
import { CanjeResponse } from '../../interfaces/Canje/ICanje';

/**
 * @class GetCanjesService
 * @description Servicio para obtener todos los canjes, opcionalmente filtrados por estado
 */
class GetCanjesService {
    /**
     * Ejecuta la operación para obtener canjes
     * @returns {Promise<CanjeResponse>} La respuesta de obtener los canjes
     */
    async execute(): Promise<CanjeResponse> {
        return await CanjeRepository.getAll()
    }
}

export default new GetCanjesService()