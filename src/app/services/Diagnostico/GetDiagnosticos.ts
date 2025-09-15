import DiagnosticoRepository from "../../repositories/Diagnostico/DiagnosticoRepository";
import { DiagnosticoResponse } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class GetDiagnosticosService
 * @description Servicio para obtener todos los diagnósticos, opcionalmente filtrados por estado
 */
class GetDiagnosticosService {
    protected diagnosticoRepository: DiagnosticoRepository

    constructor() {
        this.diagnosticoRepository = new DiagnosticoRepository()
    }

    /**
     * Ejecuta la operación para obtener diagnósticos
     * @returns {Promise<DiagnosticoResponse>} La respuesta de obtener los diagnósticos
     */
    async execute(): Promise<DiagnosticoResponse> {
        return await this.diagnosticoRepository.getAll()
    }
}

export default new GetDiagnosticosService()