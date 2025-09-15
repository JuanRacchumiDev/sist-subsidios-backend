import TipoDescansoMedicoRepository from '../../repositories/TipoDescansoMedico/TipoDescansoMedicoRepository';
import { ITipoDescansoMedico, TipoDescansoMedicoResponse } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';

/**
 * @class CreateTipoService
 * @description Servicio para crear un nuevo tipo de descanso médico.
 */
class CreateTipoService {
    protected tipoDescansoMedicoRepository: TipoDescansoMedicoRepository

    constructor() {
        this.tipoDescansoMedicoRepository = new TipoDescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para crear un tipo de descanso médico.
     * @param {ITipoDescansoMedico} data - Los datos del tipo de descanso médico a crear.
     * @returns {Promise<TipoDescansoMedicoResponse>} La respuesta de la operación.
     */
    async execute(data: ITipoDescansoMedico): Promise<TipoDescansoMedicoResponse> {
        return await this.tipoDescansoMedicoRepository.create(data);
    }
}

export default new CreateTipoService();