import EmpresaRepository from '../../repositories/Empresa/EmpresaRepository';
import { IEmpresa, EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class UpdateEstadoService
 * @description Servicio para actualizar el estado de una empresa.
 */
class UpdateEstadoService {
    protected empresaRepository: EmpresaRepository

    constructor() {
        this.empresaRepository = new EmpresaRepository()
    }

    /**
     * Ejecuta la operación para actualizar el estado de una empresa.
     * @param {string} id - El ID UUID de la empresa a actualizar.
     * @param {IEmpresa} data - Los datos parciales o completos de la empresa a actualizar.
     * @returns {Promise<EmpresaResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IEmpresa): Promise<EmpresaResponse> {
        const { estado } = data
        return await this.empresaRepository.updateEstado(id, estado as boolean);
    }
}

export default new UpdateEstadoService();