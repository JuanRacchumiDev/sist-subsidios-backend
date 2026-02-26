import PersonaRepository from "../../repositories/Persona/PersonaRepository"
import { PersonaResponse } from "../../interfaces/Persona/IPersona"

class GetPersonaUniqueService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para obtener la persona por empresa y grupo
     * @param {string} idEmpresa - Identificador de empresa 
     * @param {string} nombreGrupo - El nombre del grupo a filtrar 
     * @returns {Promise<PersonaResponse>} La respuesta de obtener la persona por empresa y grupo
     */
    async execute(idEmpresa: string, nombreGrupo: string): Promise<PersonaResponse> {
        return await this.personaRepository.getUniqueByEmpresaWithGrupo(idEmpresa, nombreGrupo)
    }
}

export default new GetPersonaUniqueService()