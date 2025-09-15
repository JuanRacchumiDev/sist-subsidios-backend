import CanjeRepository from "../../repositories/Canje/CanjeRepository";
import { CanjeResponse } from '../../interfaces/Canje/ICanje';

/**
 * @class GetCanjeService
 * @description Servicio para obtener un solo canje por ID
 */
class GetCanjeService {
    private canjeRepository: CanjeRepository

    constructor() {
        this.canjeRepository = new CanjeRepository()
    }

    /**
     * Ejecuta la operación para obtener un canje por ID
     * @param {string} id - El ID UUID del canje a buscar
     * @returns {Promise<CanjeResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<CanjeResponse> {
        return await this.canjeRepository.getById(id)
    }
}

export default new GetCanjeService()