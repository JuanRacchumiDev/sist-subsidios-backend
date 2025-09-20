import ColaboradorRepository from "../../repositories/Colaborador/ColaboradorRepository";
import { ColaboradorResponse } from '../../interfaces/Colaborador/IColaborador';

/**
 * @class GetColaboradoresService
 * @description Servicio para obtener todos los colaboradores, opcionalmente filtrados por estado
 */
class GetColaboradoresService {
    private colaboradorRepository: ColaboradorRepository

    constructor() {
        this.colaboradorRepository = new ColaboradorRepository()
    }

    /**
     * Ejecuta la operación para obtener colaboradores
     * @returns {Promise<ColaboradorResponse>} La respuesta de obtener los colaboradores
     */
    async execute(): Promise<ColaboradorResponse> {
        return await this.colaboradorRepository.getAll()
    }
}

export default new GetColaboradoresService()