import PerfilRepository from '../../repositories/Perfil/PerfilRepository';
import { IPerfil, PerfilResponse } from '../../interfaces/Perfil/IPerfil';

/**
 * @class UpdatePerfilService
 * @description Servicio para actualizar un perfil existente, incluyendo el cambio de estado.
 */
class UpdatePerfilService {
    protected perfilRepository: PerfilRepository

    constructor() {
        this.perfilRepository = new PerfilRepository()
    }

    /**
     * Ejecuta la operación para actualizar un perfil.
     * Puede actualizar cualquier campo definido en IPerfil, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID del perfil a actualizar.
     * @param {IPerfil} data - Los datos parciales o completos del perfil a actualizar.
     * @returns {Promise<PerfilResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IPerfil): Promise<PerfilResponse> {
        // Si solo se está actualizando el estado, podríamos llamar a un método más específico
        // pero para simplificar, el repositorio 'update' puede manejarlo

        // if (Object.keys(data).length === 1 && 'estado' in data && typeof data.estado === 'boolean') {
        //     return await PerfilRepository.updateEstado(id, data.estado);
        // }

        return await this.perfilRepository.update(id, data);
    }
}

export default new UpdatePerfilService();