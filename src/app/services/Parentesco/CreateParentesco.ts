import ParentescoRepository from '../../repositories/Parentesco/ParentescoRepository';
import { IParentesco, ParentescoResponse } from '../../interfaces/Parentesco/IParentesco';

/**
 * @class CreateParentescoService
 * @description Servicio para crear un nuevo parentesco.
 */
class CreateParentescoService {
    /**
     * Ejecuta la operación para crear un parentesco.
     * @param {IParentesco} data - Los datos del parentesco a crear.
     * @returns {Promise<ParentescoResponse>} La respuesta de la operación.
     */
    async execute(data: IParentesco): Promise<ParentescoResponse> {
        return await ParentescoRepository.create(data);
    }
}

export default new CreateParentescoService();