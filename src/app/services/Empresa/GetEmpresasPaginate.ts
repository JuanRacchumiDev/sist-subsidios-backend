import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository";
import { EmpresaResponsePaginate } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class GetEmpresasPaginateService
 * @description Servicio para obtener todas las empresas con paginación, opcionalmente filtrados por estado
 */
class GetEmpresasPaginateService {
    /**
     * Ejecuta la operación para obtener empresas paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {boolean | undefined} estado - Opcional. Filtra las empresas por su estado
     * @returns {Promise<EmpresaResponsePaginate>} La respuesta de obtener las empresas
     */
    async execute(page: number, limit: number, estado?: boolean): Promise<EmpresaResponsePaginate> {
        return await EmpresaRepository.getAllWithPaginate(page, limit, estado)
    }
}

export default new GetEmpresasPaginateService()