import DiagnosticoRepository from '../../repositories/Diagnostico/DiagnosticoRepository';
import { IDiagnostico, DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class CreateDiagnosticoService
 * @description Servicio para crear un diagnóstico
 */
class CreateDiagnosticoService {
    protected diagnosticoRepository: DiagnosticoRepository

    constructor() {
        this.diagnosticoRepository = new DiagnosticoRepository()
    }

    /**
     * Ejecuta la operación para crear un diagnóstico.
     * @param {IDiagnostico} data - Los datos del diagnóstico a crear.
     * @returns {Promise<DiagnosticoResponse>} La respuesta de la operación.
     */
    async execute(data: IDiagnostico): Promise<DiagnosticoResponse> {
        return await this.diagnosticoRepository.create(data);
    }
}

export default new CreateDiagnosticoService();