import DiagnosticoRepository from '../../repositories/Diagnostico/DiagnosticoRepository';
import { IDiagnostico, DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class UpdateDiagnosticoService
 * @description Servicio para actualizar un diagnóstico existente, incluyendo el cambio de estado.
 */
class UpdateDiagnosticoService {
    /**
     * Ejecuta la operación para actualizar un diagnóstico.
     * Puede actualizar cualquier campo definido en IDiagnostico, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del diagnóstico a actualizar.
     * @param {IDiagnostico} data - Los datos parciales o completos del diagnóstico a actualizar.
     * @returns {Promise<DiagnosticoResponse>} La respuesta de la operación.
     */
    async execute(codigo: string, data: IDiagnostico): Promise<DiagnosticoResponse> {
        return await DiagnosticoRepository.update(codigo, data);
    }
}

export default new UpdateDiagnosticoService();