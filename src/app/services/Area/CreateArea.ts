import AreaRepository from '../../repositories/Area/AreaRepository';
import { IArea, AreaResponse } from '../../interfaces/Area/IArea';

/**
 * @class CreateAreaService
 * @description Servicio para crear una nueva área.
 */
class CreateAreaService {
    /**
     * Ejecuta la operación para crear un área.
     * @param {IArea} data - Los datos del área a crear.
     * @returns {Promise<AreaResponse>} La respuesta de la operación.
     */
    async execute(data: IArea): Promise<AreaResponse> {
        return await AreaRepository.create(data);
    }
}

export default new CreateAreaService();