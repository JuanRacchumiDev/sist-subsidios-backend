import PersonaRepository from "../../repositories/Persona/PersonaRepository";
import { PersonaResponse } from "../../interfaces/Persona/IPersona";

/**
 * @class GetPersonasByGrupoPaginateService
 * @description Servicio para obtener las personas por grupo
 */
class GetPersonasByGrupoPaginateService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para obtener personas por grupo
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @param {string} nombreGrupo - El nombre del grupo a filtrar
     * @returns {Promise<PersonaResponse>} La respuesta de obtener las personas por grupo
     */
    async execute(page: number, limit: number, nombreGrupo: string): Promise<PersonaResponse> {
        return await this.personaRepository.getAllByGrupoWithPaginate(page, limit, nombreGrupo)
    }
}

export default new GetPersonasByGrupoPaginateService()