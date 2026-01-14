import PersonaRepository from '../../repositories/Persona/PersonaRepository';
import DetalleRepository from '../../repositories/DetalleParametro/DetalleParametroRepository'
import { IPersona, PersonaResponse } from '../../interfaces/Persona/IPersona';
import { IDetalleParametro } from '../../interfaces/DetalleParametro/IDetalleParametro'
import GrupoPersonaRepository from '../../repositories/GrupoPersona/GrupoPersonaRepository';
import { IGrupoPersona } from '../../interfaces/GrupoPersona/IGrupoPersona';

/**
 * @class UpdatePersonaService
 * @description Servicio para actualizar una persona existente, incluyendo el cambio de estado.
 */
class UpdatePersonaService {
    protected personaRepository: PersonaRepository
    protected detalleRepository: DetalleRepository
    protected grupoPersonaRepository: GrupoPersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
        this.detalleRepository = new DetalleRepository()
        this.grupoPersonaRepository = new GrupoPersonaRepository()
    }

    /**
     * Ejecuta la operación para actualizar una persona.
     * Puede actualizar cualquier campo definido en IPersona, incluyendo el nombre y el estado.
     * @param {string} id - El ID UUID de la persona a actualizar.
     * @param {IPersona} data - Los datos parciales o completos de la persona a actualizar.
     * @returns {Promise<PersonaResponse>} La respuesta de la operación.
     */
    async execute(id: string, data: IPersona): Promise<PersonaResponse> {
        let idGrupo: string = ""

        console.log('---- dataPersona execure UpdatePersonaService ----')
        console.log({ data })

        const { nombre_grupo } = data

        const response = await this.detalleRepository.getByNombre(nombre_grupo as string)
        console.log('---- response updatePersona ----')
        console.log({ response })

        const { result: resultDetalle, data: dataDetalle } = response

        if (resultDetalle && dataDetalle) {
            const { id } = dataDetalle as IDetalleParametro
            idGrupo = id as string
        }

        const responseUpdate = await this.personaRepository.update(id, data)

        const { result: resultUpdate, data: dataUpdate } = responseUpdate

        if (resultUpdate && dataUpdate) {
            const payloadGrupoPersona: IGrupoPersona = {
                id_persona: id,
                id_grupo: idGrupo
            }

            await this.grupoPersonaRepository.create(payloadGrupoPersona)

            return responseUpdate
        }

        return responseUpdate
        // return await this.personaRepository.update(id, data);
    }
}

export default new UpdatePersonaService();