import { Request, Response, NextFunction } from 'express'
import CreateDocumentoService from '../services/Documento/CreateDocumento'
import DeleteDocumentoService from '../services/Documento/DeleteDocumento'
import GetDocumentoService from '../services/Documento/GetDocumento'
import GetDocumentosService from '../services/Documento/GetDocumentos'
import UpdateDocumentoService from '../services/Documento/UpdateDocumento'
import { IDocumentoTipoCont } from '../interfaces/DocumentoTipoCont/IDocumentoTipoCont';

class DocumentoController {
    async getAllDocumentos(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetDocumentosService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getDocumentoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetDocumentoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const documentoData: IDocumentoTipoCont = req.body;
            const result = await CreateDocumentoService.execute(documentoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const documentoData: IDocumentoTipoCont = req.body;
            const result = await UpdateDocumentoService.execute(id, documentoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteDocumentoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new DocumentoController()