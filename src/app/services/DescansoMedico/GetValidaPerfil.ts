import DescansoMedicoRepository from "../../repositories/DescansoMedico/DescansoMedicoRepository";
import { DescansoMedicoResponse, IDescansoMedico } from '../../interfaces/DescansoMedico/IDescansoMedico';
import UsuarioRepository from "../../repositories/Usuario/UsuarioRepository";
import { IUsuario } from "../../interfaces/Usuario/IUsuario";

export interface IValidaPerfilResponse {
    result: boolean
    status: number;
    message: string;
}

/**
 * @class GetValidaPerfilService
 * @description Servicio para validar el perfil del usuario que registra el descanso médico
 */
class GetValidaPerfilService {
    protected usuarioRepository: UsuarioRepository
    protected descansoMedicoRepository: DescansoMedicoRepository

    constructor() {
        this.usuarioRepository = new UsuarioRepository()
        this.descansoMedicoRepository = new DescansoMedicoRepository()
    }

    /**
     * Ejecuta la operación para obtener un descanso médico por ID
     * @param {string} id - El ID UUID del descanso médico a buscar
     * @returns {Promise<IValidaPerfilResponse>} La respuesta de la operación
     */
    async execute(id: string): Promise<{ result: boolean, status: number; message: string }> {
        // return await this.descansoMedicoRepository.getValidaPerfil(id)
        const responseDM = await this.descansoMedicoRepository.getById(id)

        const { status: statusDM, data: dataDM } = responseDM

        if (statusDM && dataDM) {
            const descanso = dataDM as IDescansoMedico
            const { user_crea } = descanso

            const responseUsuario = await this.usuarioRepository.getById(user_crea as string)

            console.log({ responseUsuario })

            const { result: resultUsuario, data: dataUsuario } = responseUsuario

            if (resultUsuario && dataUsuario) {
                const usuario = dataUsuario as IUsuario

                const isValidaEspCliente = usuario && usuario.perfil && usuario.perfil.nombre_url === 'especialista-empresa'

                const nombrePerfil = (isValidaEspCliente) ? usuario.perfil?.nombre_url as string : 'sin perfil asignado'

                return {
                    result: true,
                    status: 200,
                    message: nombrePerfil
                }
            }

            return {
                result: false,
                status: 500,
                message: 'No existe usuario'
            }
        }

        return {
            result: false,
            status: 500,
            message: 'No existe descanso médico'
        }
    }
}

export default new GetValidaPerfilService()