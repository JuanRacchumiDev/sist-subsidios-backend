import PersonaRepository from "../../repositories/Persona/PersonaRepository";
import { PersonaResponse } from "../../interfaces/Persona/IPersona";

/**
 * @class GetPersonasByEmpresa
 * @description Servicio para obtener las personas por empresa
 */
class GetPersonasByEmpresa {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * 
     * @param {string} idEmpresa - El ID de la empresa a buscar 
     * @returns {Promise<PersonaResponse>} La respuesta de la operación
     */
    async execute(idEmpresa: string): Promise<PersonaResponse> {
        return await this.personaRepository.getAllByEmpresa(idEmpresa)
    }
}

export default new GetPersonasByEmpresa()