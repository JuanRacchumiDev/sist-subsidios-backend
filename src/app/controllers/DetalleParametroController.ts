import { Request, Response, NextFunction } from 'express'
import CreateDetalleService from '../services/DetalleParametro/CreateDetalle'
import GetDetalleService from '../services/DetalleParametro/GetDetalle'
import GetDetallesService from '../services/DetalleParametro/GetDetalles'
import GetDetallesPaginateService from '../services/DetalleParametro/GetDetallesPaginate'
import UpdateDetalleService from '../services/DetalleParametro/UpdateDetalle'
import { IDetalleParametro } from '../interfaces/DetalleParametro/IDetalleParametro';

class DetalleParametroController {
    async getAllDetalles(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { clase, estado, enPersona } } = req
            const paramClase = parseInt(clase as string)
            const paramEstado = ((estado as string) === "true") ? true : false
            // const paramIsPersona = ((enPersona as string) === "true") ? true : false
            const result = await GetDetallesService.execute(paramClase, paramEstado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllDetallesPaginated(req: Request, res: Response, next: NextFunction) {
        try {

            const { query, params } = req
            const { page, limit, search, parametro_clase } = query

            const definePage = parseInt(page as string) || 1

            const defineLimit = parseInt(limit as string) || 10

            // Extracción de filtros opcionales de req.query
            const defineFilter = search as string || ""

            const result = await GetDetallesPaginateService.execute(+(parametro_clase as string), definePage, defineLimit, defineFilter)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getDetalleById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetDetalleService.execute(id);
            console.log('---- result getDetalleById ----')
            console.log({ result })
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createDetalle(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req
            const detalleData: IDetalleParametro = body;
            const result = await CreateDetalleService.execute(detalleData);
            console.log({ result })
            const { status: statusDetalle } = result

            if (statusDetalle === 201) {
                res.status(statusDetalle).json(result)
            }

            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }

    async updateDetalle(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const detalleData: IDetalleParametro = req.body;
            const result = await UpdateDetalleService.execute(id, detalleData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new DetalleParametroController()