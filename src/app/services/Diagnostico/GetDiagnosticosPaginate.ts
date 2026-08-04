import DiagnosticoRepository from "../../repositories/Diagnostico/DiagnosticoRepository";
import { DiagnosticoResponsePaginate } from '../../interfaces/Diagnostico/IDiagnostico';
import { IDiagnosticoFilter } from "../../interfaces/Diagnostico/IDiagnosticoFilter";

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
     * @param {IDiagnosticoFilter} filters - los parámetros a enviar para buscar 
     * @returns {Promise<DiagnosticoResponsePaginate>} La respuesta de obtener los diagnósticos
     */
    async execute(page: number, limit: number, filters: IDiagnosticoFilter = {}): Promise<DiagnosticoResponsePaginate> {
        return await this.diagnosticoRepository.getAllPaginate(page, limit, filters)
    }
}

export default new GetDiagnosticosPaginateService()
