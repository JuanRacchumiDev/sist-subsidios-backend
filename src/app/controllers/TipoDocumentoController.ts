import { Request, Response, NextFunction } from 'express'
import CreateTipoDocumentoService from '../services/TipoDocumento/CreateTipo'
import DeleteTipoDocumentoService from '../services/TipoDocumento/DeleteTipo'
import GetTipoDocumentoService from '../services/TipoDocumento/GetTipo'
import GetTipoDocumentosService from '../services/TipoDocumento/GetTipos'
import GetByNombreService from '../services/TipoDocumento/GetByNombre'
import GetByAbreviaturaService from '../services/TipoDocumento/GetByAbreviatura'
import UpdateTipoDocumentoService from '../services/TipoDocumento/UpdateTipo'
import { ITipoDocumento } from '../interfaces/TipoDocumento/ITipoDocumento';

class TipoDocumentoController {
    async getAllTipoDocumentos(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetTipoDocumentosService.execute(estado)
            res.status(result.status || 200).json(result)
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

    async getTipoDocumentoByNombre(req: Request, res: Response, next: NextFunction) {
        try {
            // const { nombre } = req.query; // Asumiendo que se pasa como query param
            const { nombre } = req.params
            if (typeof nombre !== 'string') {
                return res.status(400).json({ result: false, message: 'El nombre es requerido como parámetro de consulta', status: 400 });
            }
            const result = await GetByNombreService.execute(nombre);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTipoDocumentoByAbreviatura(req: Request, res: Response, next: NextFunction) {
        try {
            // const { abreviatura } = req.query; // Asumiendo que se pasa como query param
            const { abreviatura } = req.params
            if (typeof abreviatura !== 'string') {
                return res.status(400).json({ result: false, message: 'La abreviatura es requerida como parámetro de consulta', status: 400 });
            }
            const result = await GetByAbreviaturaService.execute(abreviatura);
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