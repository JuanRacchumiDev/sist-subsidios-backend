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
     * @param {boolean | undefined} estado - Opcional. Filtra los parentescos por su estado
     * @returns {Promise<ParentescoResponse>} La respuesta de obtener los parentescos
     */
    async execute(estado?: boolean): Promise<ParentescoResponse> {
        // if (typeof estado === 'boolean') {
        //     return await ParentescoRepository.getAllByEstado(estado)
        // }

        return await this.parentescoRepository.getAll()
    }
}

export default new GetParentescosService()