import TrabajadorSocialRepository from "../../repositories/TrabajadorSocial/TrabajadorSocialRepository";
import { TrabajadorSocialResponse } from '../../interfaces/TrabajadorSocial/ITrabajadorSocial';

/**
 * @class GetTrabajadorSocialByIdTipoDocAndNumDocService
 * @description Servicio para obtener un trabajador social por ID tipo y número de documento
 */
class GetTrabajadorSocialByIdTipoDocAndNumDocService {
    protected trabajadorSocialRepository: TrabajadorSocialRepository

    constructor() {
        this.trabajadorSocialRepository = new TrabajadorSocialRepository()
    }

    /**
     * Ejecuta la operación para obtener un trabajador social por ID
     * @param {string} idTipoDoc - El ID del tipo de documento del trabajador social a buscar
     * @param {string} numDoc - El número de documento del trabajador social a buscar
     * @returns {Promise<TrabajadorSocialResponse>} La respuesta de la operación
     */
    async execute(idTipoDoc: string, numDoc: string): Promise<TrabajadorSocialResponse> {
        return await this.trabajadorSocialRepository.getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)
    }
}

export default new GetTrabajadorSocialByIdTipoDocAndNumDocService()