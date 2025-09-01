import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository";
import { EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class GetEmpresasService
 * @description Servicio para obtener todas las empresas, opcionalmente filtrados por estado
 */
class GetEmpresasService {
    /**
     * Ejecuta la operación para obtener empresas
     * @param {boolean | undefined} estado - Opcional. Filtra las empresas por su estado
     * @returns {Promise<EmpresaResponse>} La respuesta de obtener las empresas
     */
    async execute(estado?: boolean): Promise<EmpresaResponse> {
        if (typeof estado === 'boolean') {
            return await EmpresaRepository.getAllByEstado(estado)
        }
        return await EmpresaRepository.getAll()
    }
}

export default new GetEmpresasService()