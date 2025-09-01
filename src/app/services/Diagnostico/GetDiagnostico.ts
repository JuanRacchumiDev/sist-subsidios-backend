import DiagnosticoRepository from "../../repositories/Diagnostico/DiagnosticoRepository";
import { DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class GetDiagnosticoService
 * @description Servicio para obtener un solo diagnóstico por ID
 */
class GetDiagnosticoService {
    /**
     * Ejecuta la operación para obtener un diagnóstico por ID
     * @param {string} codCie10 - El código cie10 del diagnóstico a buscar
     * @returns {Promise<DiagnosticoResponse>} La respuesta de la operación
     */
    async execute(codCie10: string): Promise<DiagnosticoResponse> {
        return await DiagnosticoRepository.getByCodigo(codCie10)
    }
}

export default new GetDiagnosticoService()