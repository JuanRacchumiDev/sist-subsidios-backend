import { Request, Response, NextFunction } from 'express'
import CreateAreaService from '../services/Area/CreateArea'
import DeleteAreaService from '../services/Area/DeleteArea'
import GetAreaService from '../services/Area/GetArea'
import GetAreasService from '../services/Area/GetAreas'
import GetByNombreService from '../services/Area/GetByNombre'
import UpdateAreaService from '../services/Area/UpdateArea'
import { IArea } from '../interfaces/Area/IArea';

class AreaController {
    async getAllAreas(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetAreasService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
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
            const { nombre } = req.query; // Asumiendo que se pasa como query param
            if (typeof nombre !== 'string') {
                return res.status(400).json({ result: false, message: 'El nombre es requerido como parámetro de consulta', status: 400 });
            }
            const result = await GetByNombreService.execute(nombre);
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