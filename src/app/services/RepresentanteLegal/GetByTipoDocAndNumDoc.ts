import RepresentanteRepository from "../../repositories/RepresentanteLegal/RepresentanteRepository";
import { RepresentanteLegalResponse } from '../../interfaces/RepresentanteLegal/IRepresentanteLegal';

/**
 * @class GetRepresentanteByIdTipoDocAndNumDocServicelegal
 * @description Servicio para obtener un representante legal por ID tipo y número de documento
 */
class GetRepresentanteByIdTipoDocAndNumDocServicelegal {
    protected representanteRepository: RepresentanteRepository

    constructor() {
        this.representanteRepository = new RepresentanteRepository()
    }

    /**
     * Ejecuta la operación para obtener un representante legal por ID
     * @param {string} idTipoDoc - El ID del tipo de documento del representante legal a buscar
     * @param {string} numDoc - El número de documento del representante legal a buscar
     * @returns {Promise<RepresentanteLegalResponse>} La respuesta de la operación
     */
    async execute(idTipoDoc: string, numDoc: string): Promise<RepresentanteLegalResponse> {
        return await this.representanteRepository.getByIdTipoDocAndNumDoc(idTipoDoc, numDoc)
    }
}

export default new GetRepresentanteByIdTipoDocAndNumDocServicelegal()