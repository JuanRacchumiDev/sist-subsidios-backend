import DiagnosticoRepository from '../../repositories/Diagnostico/DiagnosticoRepository';
import { IDiagnostico, DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class UpdateEstadoService
 * @description Servicio para actualizar el estado de un diagnóstico.
 */
class UpdateEstadoService {
    protected diagnosticoRepository: DiagnosticoRepository

    constructor() {
        this.diagnosticoRepository = new DiagnosticoRepository()
    }

    /**
     * Ejecuta la operación para actualizar el estado de un diagnóstico.
     * @param {string} id - El ID UUID del diagnóstico a actualizar.
     * @param {IDiagnostico} data - Los datos parciales o completos del diagnóstico a actualizar.
     * @returns {Promise<DiagnosticoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IDiagnostico): Promise<DiagnosticoResponse> {
        const { estado } = data
        return await this.diagnosticoRepository.updateEstado(id, estado as boolean);
    }
}

export default new UpdateEstadoService();