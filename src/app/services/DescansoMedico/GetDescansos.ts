import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { DescansoMedicoResponse } from '../../interfaces/DescansoMedico/IDescansoMedico';

/**
 * @class GetDescansosService
 * @description Servicio para obtener todos los descansos médicos, opcionalmente filtrados por estado
 */
class GetDescansosService {
    /**
     * Ejecuta la operación para obtener descansos médicos
     * @returns {Promise<DescansoMedicoResponse>} La respuesta de obtener los descansos médicos
     */
    async execute(): Promise<DescansoMedicoResponse> {
        return await DescansoMedicoRepository.getAll()
    }
}

export default new GetDescansosService()