import PersonaRepository from "../../repositories/Persona/PersonaRepository"
import { PersonaResponse } from "../../interfaces/Persona/IPersona"

class GetPersonasByEmpresaAndGrupoService {
    protected personaRepository: PersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
    }

    /**
     * Ejecuta la operación para obtener personas por empresa y grupo
     * @param {string} idEmpresa - Identificador de empresa 
     * @param {string} nombreGrupo - El nombre del grupo a filtrar 
     * @returns {Promise<PersonaResponse>} La respuesta de obtener personas por empresa y grupo
     */
    async execute(idEmpresa: string, nombreGrupo: string): Promise<PersonaResponse> {
        return await this.personaRepository.getAllByEmpresaWithGrupo(idEmpresa, nombreGrupo)
    }
}

export default new GetPersonasByEmpresaAndGrupoService()