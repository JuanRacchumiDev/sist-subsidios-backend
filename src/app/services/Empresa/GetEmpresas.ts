import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository";
import { EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class GetEmpresasService
 * @description Servicio para obtener todas las empresas, opcionalmente filtrados por estado
 */
class GetEmpresasService {
    /**
     * Ejecuta la operación para obtener emoresas
     * @returns {Promise<EmpresaResponse>} La respuesta de obtener las empresas
     */
    async execute(): Promise<EmpresaResponse> {
        return await EmpresaRepository.getAll()
    }
}

export default new GetEmpresasService()