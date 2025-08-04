import PersonaRepository from '../../repositories/Persona/PersonaRepository';
import { IPersona, PersonaResponse } from '../../interfaces/Persona/IPersona';

/**
 * @class CreatePersonaService
 * @description Servicio para crear una nueva persona.
 */
class CreatePersonaService {
    /**
     * Ejecuta la operación para crear una persona.
     * @param {IPersona} data - Los datos de la persona a crear.
     * @returns {Promise<PersonaResponse>} La respuesta de la operación.
     */
    async execute(data: IPersona): Promise<PersonaResponse> {
        return await PersonaRepository.create(data);
    }
}

export default new CreatePersonaService();