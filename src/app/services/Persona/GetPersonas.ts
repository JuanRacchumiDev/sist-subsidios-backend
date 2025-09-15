import PersonaRepository from "../../repositories/Persona/PersonaRepository";
import { PersonaResponse } from '../../interfaces/Persona/IPersona';

/**
 * @class GetPersonasService
 * @description Servicio para obtener todas las personas, opcionalmente filtrados por estado
 */
class GetPersonasService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para obtener personas
     * @returns {Promise<PersonaResponse>} La respuesta de obtener las personas
     */
    async execute(): Promise<PersonaResponse> {
        return await this.personaRepository.getAll()
    }
}

export default new GetPersonasService()