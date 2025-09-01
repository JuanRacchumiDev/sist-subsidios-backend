import { NextFunction, Response, Request } from "express";
import GetCanjesService from '../services/Canje/GetCanjes'
import GetCanjeService from '../services/Canje/GetCanje'
import CreateCanjeService from '../services/Canje/CreateCanje'
import UpdateCanjeService from '../services/Canje/UpdateCanje'
import { ICanje } from "../interfaces/Canje/ICanje";
import GetCanjesPaginateService from "../services/Canje/GetCanjesPaginate";

class CanjeController {
    async getAllCanjes(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetCanjesService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllCanjesPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetCanjesPaginateService.execute(page, limit, estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getCanjeById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetCanjeService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createCanje(req: Request, res: Response, next: NextFunction) {
        try {
            const canjeData: ICanje = req.body;
            const result = await CreateCanjeService.execute(canjeData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateCanje(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const canjeData: ICanje = req.body;
            const result = await UpdateCanjeService.execute(id, canjeData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new CanjeController()