import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';

/**
 * @class GetDescansoService
 * @description Servicio para obtener un solo descanso médico por ID
 */
class GetDescansoService {
    /**
     * Ejecuta la operación para obtener un descanso médico por ID
     * @param {string} id - El ID UUID del descanso médico a buscar
     * @returns {Promise<DescansoMedicoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<DescansoMedicoResponse> {
        return await DescansoMedicoRepository.getById(id)
    }
}

export default new GetDescansoService()