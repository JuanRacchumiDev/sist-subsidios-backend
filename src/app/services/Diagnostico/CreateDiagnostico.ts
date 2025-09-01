import DiagnosticoRepository from '../../repositories/Diagnostico/DiagnosticoRepository';
import { IDiagnostico, DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class CreateDiagnosticoService
 * @description Servicio para crear un diagnóstico
 */
class CreateDiagnosticoService {
    /**
     * Ejecuta la operación para crear un diagnóstico.
     * @param {IDiagnostico} data - Los datos del diagnóstico a crear.
     * @returns {Promise<DiagnosticoResponse>} La respuesta de la operación.
     */
    async execute(data: IDiagnostico): Promise<DiagnosticoResponse> {
        return await DiagnosticoRepository.create(data);
    }
}

export default new CreateDiagnosticoService();