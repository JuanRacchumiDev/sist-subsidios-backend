import { Request, Response, NextFunction } from 'express'
import CreateTipoAdjuntoService from '../services/TipoAdjunto/CreateTipoAdjunto'
import DeleteTipoAdjuntoService from '../services/TipoAdjunto/DeleteTipoAdjunto'
import GetTipoAdjuntoService from '../services/TipoAdjunto/GetTipoAdjunto'
import GetTipoAdjuntosService from '../services/TipoAdjunto/GetTipoAdjuntos'
import GetTipoAdjuntoByNombreService from '../services/TipoAdjunto/GetTipoAdjuntoByNombre'
import UpdateTipoAdjuntoService from '../services/TipoAdjunto/UpdateTipoAdjunto'
import { ITipoAdjunto } from '../interfaces/TipoAdjunto/ITipoAdjunto';

class TipoAdjuntoController {
    async getAllTipoAdjuntos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetTipoAdjuntosService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getTipoAdjuntoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetTipoAdjuntoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getTipoAdjuntoByNombre(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { nombre } } = req

            if (!nombre) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El nombre es requerido como parámetro de consulta'
                    }
                );
            }

            const result = await GetTipoAdjuntoByNombreService.execute(nombre as string);

            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error)
        }
    }

    async createTipoAjunto(req: Request, res: Response, next: NextFunction) {
        try {
            const tipoAdjuntoData: ITipoAdjunto = req.body;
            const result = await CreateTipoAdjuntoService.execute(tipoAdjuntoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateTipoAjunto(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const tipoAdjuntoData: ITipoAdjunto = req.body;
            const result = await UpdateTipoAdjuntoService.execute(id, tipoAdjuntoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteTipoAjunto(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteTipoAdjuntoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new TipoAdjuntoController()