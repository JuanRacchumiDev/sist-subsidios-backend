import DiagnosticoRepository from "../../repositories/Diagnostico/DiagnosticoRepository";
import { DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class GetDiagnosticosService
 * @description Servicio para obtener todos los diagnósticos, opcionalmente filtrados por estado
 */
class GetDiagnosticosService {
    /**
     * Ejecuta la operación para obtener diagnósticos
     * @returns {Promise<DiagnosticoResponse>} La respuesta de obtener los diagnósticos
     */
    async execute(): Promise<DiagnosticoResponse> {
        return await DiagnosticoRepository.getAll()
    }
}

export default new GetDiagnosticosService()