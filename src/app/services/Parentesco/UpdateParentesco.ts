import ParentescoRepository from '../../repositories/Parentesco/ParentescoRepository';
import { IParentesco, ParentescoResponse } from '../../interfaces/Parentesco/IParentesco';

/**
 * @class UpdateParentescoService
 * @description Servicio para actualizar un parentesco existente, incluyendo el cambio de estado.
 */
class UpdateParentescoService {
    protected parentescoRepository: ParentescoRepository

    constructor() {
        this.parentescoRepository = new ParentescoRepository()
    }

    /**
     * Ejecuta la operación para actualizar un parentesco.
     * Puede actualizar cualquier campo definido en IParentesco, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del parentesco a actualizar.
     * @param {IParentesco} data - Los datos parciales o completos del parentesco a actualizar.
     * @returns {Promise<ParentescoResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IParentesco): Promise<ParentescoResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo

        // if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
        //     return await ParentescoRepository.updateEstado(id, data.estado);
        // }

        return await this.parentescoRepository.update(id, data);
    }
}

export default new UpdateParentescoService();