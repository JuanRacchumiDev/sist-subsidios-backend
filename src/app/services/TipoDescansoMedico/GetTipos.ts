import TipoDescansoMedicoRepository from "../../repositories/TipoDescansoMedico/TipoDescansoMedicoRepository";
import { TipoDescansoMedicoResponse } from '../../interfaces/TipoDescansoMedico/ITipoDescansoMedico';

/**
 * @class GetTiposService
 * @description Servicio para obtener todos los tipos de descanso médicos, opcionalmente filtrados por estado
 */
class GetTiposService {
    /**
     * Ejecuta la operación para obtener tipo de descanso médicos
     * @param {boolean | undefined} estado - Opcional. Filtra los tipo de descanso médicos por su estado
     * @returns {Promise<TipoDescansoMedicoResponse>} La respuesta de obtener los tipo de descanso médicos
     */
    async execute(estado?: boolean): Promise<TipoDescansoMedicoResponse> {
        if (typeof estado === 'boolean') {
            return await TipoDescansoMedicoRepository.getAllByEstado(estado)
        }
        return await TipoDescansoMedicoRepository.getAll()
    }
}

export default new GetTiposService()