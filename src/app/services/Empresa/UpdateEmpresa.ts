import EmpresaRepository from '../../repositories/Empresa/EmpresaRepository';
import { IEmpresa, EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class UpdateEmpresaService
 * @description Servicio para actualizar una empresa existente, incluyendo el cambio de estado.
 */
class UpdateEmpresaService {
    protected empresaRepository: EmpresaRepository

    constructor() {
        this.empresaRepository = new EmpresaRepository()
    }

    /**
     * Ejecuta la operación para actualizar una empresa.
     * Puede actualizar cualquier campo definido en IEmpresa, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID de la empresa a actualizar.
     * @param {IEmpresa} data - Los datos parciales o completos de la empresa a actualizar.
     * @returns {Promise<EmpresaResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IEmpresa): Promise<EmpresaResponse> {
        return await this.empresaRepository.update(id, data);
    }
}

export default new UpdateEmpresaService();