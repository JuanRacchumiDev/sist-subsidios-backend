import PersonaRepository from "../../repositories/Persona/PersonaRepository";
import { PersonaResponse } from "../../interfaces/Persona/IPersona";

/**
 * @class GetByIdTipoAndNumDocService
 * @description Servicio para obtener una sola persona por tipo y número de documento
 */
class GetByIdTipoAndNumDocService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * 
     * @param {string} idTipoDoc - El ID del tipo de documento de la persona a buscar 
     * @param {string} numDoc - El número de documento de la persona a buscar
     * @returns {Promise<PersonaResponse>} La respuesta de la operación
     */
    async execute(idTipoDoc: string, numDoc: string): Promise<PersonaResponse> {
        return await this.personaRepository.getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)
    }
}

export default new GetByIdTipoAndNumDocService()