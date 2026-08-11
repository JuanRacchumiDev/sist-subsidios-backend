import PersonaRepository from '../../repositories/Persona/PersonaRepository';
import { IPersona, PersonaResponse } from '../../interfaces/Persona/IPersona';
import DetalleRepository from '../../repositories/DetalleParametro/DetalleParametroRepository'
import { IDetalleParametro } from '../../interfaces/DetalleParametro/IDetalleParametro'
import GrupoPersonaRepository from '../../repositories/GrupoPersona/GrupoPersonaRepository';
import { IGrupoPersona } from '../../interfaces/GrupoPersona/IGrupoPersona';

/**
 * @class CreatePersonaService
 * @description Servicio para crear una nueva persona.
 */
class CreatePersonaService {
    protected personaRepository: PersonaRepository
    protected detalleRepository: DetalleRepository
    protected grupoPersonaRepository: GrupoPersonaRepository

    constructor() {
        this.personaRepository = new PersonaRepository()
        this.detalleRepository = new DetalleRepository()
        this.grupoPersonaRepository = new GrupoPersonaRepository()
    }

    /**
     * Ejecuta la operación para crear una persona.
     * @param {IPersona} data - Los datos de la persona a crear.
     * @returns {Promise<PersonaResponse>} La respuesta de la operación.
     */
    async execute(data: IPersona): Promise<PersonaResponse> {
        let idGrupo: string = ""

        const { nombre_grupo } = data

        const response = await this.detalleRepository.getByNombre(nombre_grupo as string)

        const { result: resultDetalle, data: dataDetalle } = response

        if (resultDetalle && dataDetalle) {
            const { id } = dataDetalle as IDetalleParametro
            idGrupo = id as string
        }

        const responseCreate = await this.personaRepository.create(data);

        const { result: resultCreate, data: dataCreate } = responseCreate

        if (resultCreate && dataCreate) {
            const persona = dataCreate as IPersona

            const { id: idPersona } = persona

            const payloadGrupoPersona: IGrupoPersona = {
                id_persona: idPersona,
                id_grupo: idGrupo
            }

            console.log({ payloadGrupoPersona })

            const responseValidarGrupo = await this.grupoPersonaRepository.validar(payloadGrupoPersona)

            console.log({ responseValidarGrupo })

            const { result: resultValidarGrupo, data: dataValidarGrupo } = responseValidarGrupo

            console.log({ resultValidarGrupo })

            console.log({ dataValidarGrupo })

            if (!resultValidarGrupo && Array.isArray(dataValidarGrupo) && dataValidarGrupo.length === 0) {
                console.log('asignar grupo a persona')
                await this.grupoPersonaRepository.create(payloadGrupoPersona)

                return responseCreate
            }
        }

        return responseCreate
    }
}

export default new CreatePersonaService();