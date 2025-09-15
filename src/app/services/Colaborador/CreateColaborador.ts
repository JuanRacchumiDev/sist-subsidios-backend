import ColaboradorRepository from '../../repositories/Colaborador/ColaboradorRepository';
import { IColaborador, ColaboradorResponse } from '../../interfaces/Colaborador/IColaborador';

/**
 * @class CreateColaboradorService
 * @description Servicio para crear un nuevo colaborador.
 */
class CreateColaboradorService {
    private colaboradorRepository: ColaboradorRepository

    constructor() {
        this.colaboradorRepository = new ColaboradorRepository()
    }

    /**
     * Ejecuta la operación para crear un colaborador.
     * @param {IColaborador} data - Los datos del colaborador a crear.
     * @returns {Promise<ColaboradorResponse>} La respuesta de la operación.
     */
    async execute(data: IColaborador): Promise<ColaboradorResponse> {
        return await this.colaboradorRepository.create(data);
    }
}

export default new CreateColaboradorService();