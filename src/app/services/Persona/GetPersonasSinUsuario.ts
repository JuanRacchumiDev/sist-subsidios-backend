import PersonaRepository from "../../repositories/Persona/PersonaRepository";
import { PersonaResponse } from '../../interfaces/Persona/IPersona';

/**
 * @class GetPersonasSinUsuarioService
 * @description Servicio para obtener todas las personas sin usuario, opcionalmente filtrados por estado
 */
class GetPersonasSinUsuarioService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para obtener personas
     * @returns {Promise<PersonaResponse>} La respuesta de obtener las personas
     */
    async execute(): Promise<PersonaResponse> {
        return await this.personaRepository.getAllSinUsuario()
    }
}

export default new GetPersonasSinUsuarioService()