import PersonaRepository from "../../repositories/Persona/PersonaRepository";
import { PersonaResponse } from '../../interfaces/Persona/IPersona';

/**
 * @class GetPersonaService
 * @description Servicio para obtener una sola persona por ID
 */
class GetPersonaService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para obtener una persona por ID
     * @param {string} id - El ID UUID de la persona a buscar
     * @returns {Promise<PersonaResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<PersonaResponse> {
        return await this.personaRepository.getById(id)
    }
}

export default new GetPersonaService()