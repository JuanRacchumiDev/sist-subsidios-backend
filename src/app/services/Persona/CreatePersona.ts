import PersonaRepository from '../../repositories/Persona/PersonaRepository';
import { IPersona, PersonaResponse } from '../../interfaces/Persona/IPersona';

/**
 * @class CreatePersonaService
 * @description Servicio para crear una nueva persona.
 */
class CreatePersonaService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para crear una persona.
     * @param {IPersona} data - Los datos de la persona a crear.
     * @returns {Promise<PersonaResponse>} La respuesta de la operación.
     */
    async execute(data: IPersona): Promise<PersonaResponse> {
        return await this.personaRepository.create(data);
    }
}

export default new CreatePersonaService();