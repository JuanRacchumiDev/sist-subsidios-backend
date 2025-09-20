import DocumentoTipoContRepository from "../../repositories/DocumentoTipoCont/DocumentoTipoContRepository";
import { DocumentoTipoContResponsePaginate } from '../../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

/**
 * @class GetDocumentosTipoContPaginateService
 * @description Servicio para obtener todas los documentos con paginación, opcionalmente filtrados por estado
 */
class GetDocumentosTipoContPaginateService {
    protected documentoTipoContRepository: DocumentoTipoContRepository

    constructor() {
        this.documentoTipoContRepository = new DocumentoTipoContRepository()
    }

    /**
     * Ejecuta la operación para obtener documentos paginadas
     * @param {number} page - El número de la página actual
     * @param {number} limit - El número de ítems por página
     * @returns {Promise<DocumentoTipoContResponsePaginate>} La respuesta de obtener los documentos
     */
    async execute(page: number, limit: number): Promise<DocumentoTipoContResponsePaginate> {
        return await this.documentoTipoContRepository.getAllWithPaginate(page, limit)
    }
}

export default new GetDocumentosTipoContPaginateService()
