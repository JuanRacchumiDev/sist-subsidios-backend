import ParentescoRepository from '../../repositories/Parentesco/ParentescoRepository';
import { ParentescoResponse } from '../../interfaces/Parentesco/IParentesco';

/**
 * @class GetByNombreService
 * @description Servicio para obtener un parentesco por su nombre.
 */
class GetByNombreService {
    protected parentescoRepository: ParentescoRepository

    constructor() {
        this.parentescoRepository = new ParentescoRepository()
    }

    /**
     * Ejecuta la operación para obtener un parentesco por nombre.
     * @param {string} nombre - El nombre del parentesco a buscar.
     * @returns {Promise<ParentescoResponse>} La respuesta de la operación.
     */
    async execute(nombre: string): Promise<ParentescoResponse> {
        return await this.parentescoRepository.getByNombre(nombre);
    }
}

export default new GetByNombreService();