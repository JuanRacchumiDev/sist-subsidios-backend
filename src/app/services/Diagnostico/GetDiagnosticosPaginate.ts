import DiagnosticoRepository from "../../repositories/Diagnostico/DiagnosticoRepository";
import { DiagnosticoResponsePaginate } from '../../interfaces/Diagnostico/IDiagnostico';

/**
 * @class GetDiagnosticosPaginateService
 * @description Servicio para obtener todas los diagnóssticos con paginación, opcionalmente filtrados por estado
 */
class GetDiagnosticosPaginateService {
    private diagnosticoRepository: DiagnosticoRepository

    constructor() {
        this.diagnosticoRepository = new DiagnosticoRepository()
    }

    /**
     * Ejecuta la operación para obtener diagnósticos paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {string} filter - Parámetro a enviar para buscar
     * @returns {Promise<DiagnosticoResponsePaginate>} La respuesta de obtener los diagnósticos
     */
    async execute(page: number, limit: number, filter: string): Promise<DiagnosticoResponsePaginate> {
        return await this.diagnosticoRepository.getAllWithPaginate(page, limit, filter)
    }
}

export default new GetDiagnosticosPaginateService()
