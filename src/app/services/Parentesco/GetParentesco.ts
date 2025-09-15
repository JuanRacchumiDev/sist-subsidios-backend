import ParentescoRepository from "../../repositories/Parentesco/ParentescoRepository";
import { ParentescoResponse } from '../../interfaces/Parentesco/IParentesco';

/**
 * @class GetParentescoService
 * @description Servicio para obtener un solo parentesco por ID
 */
class GetParentescoService {
    protected parentescoRepository: ParentescoRepository

    constructor() {
        this.parentescoRepository = new ParentescoRepository()
    }

    /**
     * Ejecuta la operación para obtener un parentesco por ID
     * @param {string} id - El ID UUID del parentesco a buscar
     * @returns {Promise<ParentescoResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<ParentescoResponse> {
        return await this.parentescoRepository.getById(id)
    }
}

export default new GetParentescoService()