import EmpresaRepository from '../../repositories/Empresa/EmpresaRepository';
import { IEmpresa, EmpresaResponse } from '../../interfaces/Empresa/IEmpresa';

/**
 * @class UpdateEmpresaService
 * @description Servicio para actualizar una empresa existente, incluyendo el cambio de estado.
 */
class UpdateEmpresaService {
    /**
     * Ejecuta la operación para actualizar una empresa.
     * Puede actualizar cualquier campo definido en IEmpresa, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID de la empresa a actualizar.
     * @param {IEmpresa} data - Los datos parciales o completos de la empresa a actualizar.
     * @returns {Promise<EmpresaResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IEmpresa): Promise<EmpresaResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo
        if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
            return await EmpresaRepository.updateEstado(id, data.estado);
        }
        return await EmpresaRepository.update(id, data);
    }
}

export default new UpdateEmpresaService();