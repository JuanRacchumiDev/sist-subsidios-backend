import { Request, Response, NextFunction } from 'express'
import CreateDocumentoTipoContService from '../services/DocumentoTipoCont/CreateDocumentoTipoCont'
import DeleteDocumentoTipoContService from '../services/DocumentoTipoCont/DeleteDocumentoTipoCont'
import GetDocumentoTipoContService from '../services/DocumentoTipoCont/GetDocumentoTipoCont'
import GetDocumentosTipoContService from '../services/DocumentoTipoCont/GetDocumentosTipoCont'
import UpdateDocumentoTipoContService from '../services/DocumentoTipoCont/UpdateDocumentoTipoCont'
import GetDocumentosTipoContPaginateService from "../services/DocumentoTipoCont/GetDocumentosTipoContPaginate"
import { IDocumentoTipoCont } from '../interfaces/DocumentoTipoCont/IDocumentoTipoCont';
import { IDocumentoTipoContFilter } from '../interfaces/DocumentoTipoCont/IDocumentoTipoContFilter'

class DocumentoTipoContController {
    async getAllDocumentos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetDocumentosTipoContService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllDocumentosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            const {
                id_tipocontingencia,
                nombre
            } = req.query

            const filters: IDocumentoTipoContFilter = {
                id_tipocontingencia: id_tipocontingencia as string,
                nombre: nombre as string
            }

            const result = await GetDocumentosTipoContPaginateService.execute(page, limit, filters)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getDocumentoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetDocumentoTipoContService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const documentoData: IDocumentoTipoCont = req.body;
            const result = await CreateDocumentoTipoContService.execute(documentoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const documentoData: IDocumentoTipoCont = req.body;
            const result = await UpdateDocumentoTipoContService.execute(id, documentoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteDocumentoTipoContService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new DocumentoTipoContController()