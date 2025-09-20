import { Request, Response, NextFunction } from 'express'
import CreateAreaService from '../services/Area/CreateArea'
import DeleteAreaService from '../services/Area/DeleteArea'
import GetAreaService from '../services/Area/GetArea'
import GetAreasService from '../services/Area/GetAreas'
import GetAreasPaginateService from '../services/Area/GetAreasPaginate'
import GetAreaByNombreService from '../services/Area/GetByNombre'
import UpdateAreaService from '../services/Area/UpdateArea'
import { IArea } from '../interfaces/Area/IArea';

class AreaController {
    async getAllAreas(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetAreasService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllAreasPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            const result = await GetAreasPaginateService.execute(page, limit)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAreaById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetAreaService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getAreaByNombre(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { nombre } } = req

            if (!nombre) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El nombre es requerido como parámetro de consulta',
                        status: 400
                    }
                );
            }

            const nombreStr = nombre as string

            const result = await GetAreaByNombreService.execute(nombreStr);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createArea(req: Request, res: Response, next: NextFunction) {
        try {
            const areaData: IArea = req.body;
            const result = await CreateAreaService.execute(areaData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateArea(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const areaData: IArea = req.body;
            const result = await UpdateAreaService.execute(id, areaData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteArea(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteAreaService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new AreaController()