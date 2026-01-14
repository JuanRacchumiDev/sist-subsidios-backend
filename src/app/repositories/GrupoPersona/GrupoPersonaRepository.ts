import { GrupoPersona } from "../../models/GrupoPersona";
import { GrupoPersonaResponse, IGrupoPersona } from "../../interfaces/GrupoPersona/IGrupoPersona";

class GrupoPersonaRepository {
    async create(data: IGrupoPersona): Promise<GrupoPersonaResponse> {
        try {
            const newGtupoPersona = await GrupoPersona.create(data)

            const { id } = newGtupoPersona

            if (id) {
                return { result: true, message: 'Persona asignada a un grupo registrado con éxito', data: newGtupoPersona, status: 200 }
            }

            return { result: false, message: 'Error al registrar la persona a un grupo', status: 500 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, message: 'No se pudo crear el detalle', error: errorMessage, status: 500 }
        }
    }
}

export default GrupoPersonaRepository