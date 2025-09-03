import { Request, Response, NextFunction } from 'express'
import CreateTipoDocumentoService from '../services/TipoDocumento/CreateTipo'
import DeleteTipoDocumentoService from '../services/TipoDocumento/DeleteTipo'
import GetTipoDocumentoService from '../services/TipoDocumento/GetTipo'
import GetTipoDocumentosService from '../services/TipoDocumento/GetTipos'
import GetBySearchService from '../services/TipoDocumento/GetBySearch'
import UpdateTipoDocumentoService from '../services/TipoDocumento/UpdateTipo'
import { ITipoDocumento } from '../interfaces/TipoDocumento/ITipoDocumento';
import { TTipoDocumentoSearch } from '../types/TipoDocumento/TTipoDocumentoSearch'

class TipoDocumentoController {
    async getAllTipoDocumentos(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await GetTipoDocumentosService.execute()
            const { status } = response
            res.status(status || 200).json(response)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getTipoDocumentoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetTipoDocumentoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTipoDocumentoBySearch(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { nombre, abreviatura } } = req

            const search: TTipoDocumentoSearch = {}

            if (typeof nombre === 'string') {
                search.nombre = nombre
            }

            if (typeof abreviatura === 'string') {
                search.abreviatura = abreviatura
            }

            if (!search.nombre && !search.abreviatura) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El nombre o abreviatura son requeridos como parámetro de consulta',
                        status: 400
                    }
                );
            }

            const result = await GetBySearchService.execute(search);
            res.status(result.status || 200).json(result);

        } catch (error) {
            next(error);
        }
    }

    async createTipoDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const tipoDocumentoData: ITipoDocumento = req.body;
            const result = await CreateTipoDocumentoService.execute(tipoDocumentoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateTipoDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tipoDocumentoData: ITipoDocumento = req.body;
            const result = await UpdateTipoDocumentoService.execute(id, tipoDocumentoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteTipoDocumento(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteTipoDocumentoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new TipoDocumentoController()