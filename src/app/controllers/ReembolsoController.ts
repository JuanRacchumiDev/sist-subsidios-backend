import { NextFunction, Response, Request } from "express";
import GetReembolsosService from '../services/Reembolso/GetReembolsos'
import GetReembolsoService from '../services/Reembolso/GetReembolso'
import CreateReembolsoService from '../services/Reembolso/CreateReembolso'
// import UpdateCanjeService from '../services/Reembolso/UpdateCanje'
import { IReembolso } from "../interfaces/Reembolso/IReembolso";
import GetReembolsosPaginateService from "../services/Reembolso/GetReembolsosPaginate";

class ReembolsoController {
    async getAllReembolsos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetReembolsosService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllReembolsosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            const result = await GetReembolsosPaginateService.execute(page, limit)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getReembolsoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetReembolsoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createReembolso(req: Request, res: Response, next: NextFunction) {
        try {
            const reembolsoData: IReembolso = req.body;
            const result = await CreateReembolsoService.execute(reembolsoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    // async updateReembolso(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { id } = req.params;
    //         const reembolsoData: IReembolso = req.body;
    //         const result = await UpdateCanjeService.execute(id, reembolsoData);
    //         res.status(result.status || 200).json(result);
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}

export default new ReembolsoController()