import EmpresaRepository from "../../repositories/Empresa/EmpresaRepository";
import { EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class GetEmpresasService
 * @description Servicio para obtener todas las empresas, opcionalmente filtrados por estado
 */
class GetEmpresasService {
    protected empresaRepository: EmpresaRepository

    constructor() {
        this.empresaRepository = new EmpresaRepository()
    }

    /**
     * Ejecuta la operación para obtener empresas
     * @param {boolean | undefined} estado - Opcional. Filtra las empresas por su estado
     * @returns {Promise<EmpresaResponse>} La respuesta de obtener las empresas
     */
    async execute(estado?: boolean): Promise<EmpresaResponse> {
        // if (typeof estado === 'boolean') {
        //     return await this.empresaRepository.getAllByEstado(estado)
        // }

        return await this.empresaRepository.getAll()
    }
}

export default new GetEmpresasService()