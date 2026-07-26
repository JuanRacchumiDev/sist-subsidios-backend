import DiagnosticoRepository from '../../repositories/Diagnostico/DiagnosticoRepository';
import { DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class DeleteDiagnosticoService
 * @description Servicio para eliminar (soft delete) un diagnóstico.
 */
class DeleteDiagnosticoService {
    private diagnosticoRepository: DiagnosticoRepository

    constructor() {
        this.diagnosticoRepository = new DiagnosticoRepository()
    }

    /**
     * Ejecuta la operación de eliminación para un diagnóstico.
     * @param {string} id - El ID UUID del diagnóstico a eliminar.
     * @returns {Promise<DiagnosticoResponse>} La respuesta de la operación.
     */
    async execute(id: string): Promise<DiagnosticoResponse> {
        return await this.diagnosticoRepository.delete(id);
    }
}

export default new DeleteDiagnosticoService();