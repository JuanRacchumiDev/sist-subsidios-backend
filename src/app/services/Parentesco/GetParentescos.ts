import ParentescoRepository from "../../repositories/Parentesco/ParentescoRepository";
import { ParentescoResponse } from '../../interfaces/Parentesco/IParentesco';

/**
 * @class GetParentescosService
 * @description Servicio para obtener todos los parentescos, opcionalmente filtrados por estado
 */
class GetParentescosService {
    protected parentescoRepository: ParentescoRepository

    constructor() {
        this.parentescoRepository = new ParentescoRepository()
    }

    /**
     * Ejecuta la operación para obtener parentescos
     * @returns {Promise<ParentescoResponse>} La respuesta de obtener los parentescos
     */
    async execute(): Promise<ParentescoResponse> {
        return await this.parentescoRepository.getAll()
    }
}

export default new GetParentescosService()