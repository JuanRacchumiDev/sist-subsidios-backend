import PersonaRepository from '../../repositories/Persona/PersonaRepository';
import { IPersona, PersonaResponse } from '../../interfaces/Persona/IPersona';

/**
 * @class UpdatePersonaService
 * @description Servicio para actualizar una persona existente, incluyendo el cambio de estado.
 */
class UpdatePersonaService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para actualizar una persona.
     * Puede actualizar cualquier campo definido en IPersona, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID de la persona a actualizar.
     * @param {IPersona} data - Los datos parciales o completos de la persona a actualizar.
     * @returns {Promise<PersonaResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IPersona): Promise<PersonaResponse> {
        return await this.personaRepository.update(id, data);
    }
}

export default new UpdatePersonaService();