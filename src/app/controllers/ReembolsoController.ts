import { NextFunction, Response, Request } from "express";
import GetReembolsosService from '../services/Reembolso/GetReembolsos'
import GetReembolsoService from '../services/Reembolso/GetReembolso'
import CreateReembolsoService from '../services/Reembolso/CreateReembolso'
import UpdateReembolsoService from '../services/Reembolso/UpdateReembolso'
import { IReembolso } from "../interfaces/Reembolso/IReembolso";
import GetReembolsosPaginateService from "../services/Reembolso/GetReembolsosPaginate";
import { IReembolsoFilter } from "../interfaces/Reembolso/IReembolsoFilter";

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
            const { query: { page, limit, search, fecha_pago, numero_expediente } } = req

            const setPage = parseInt(page as string) || 1

            const setLimit = parseInt(limit as string) || 10

            const filters: IReembolsoFilter = {
                search: (search as string)?.trim(),
                fecha_pago: fecha_pago as string,
                numero_expediente: numero_expediente as string
            }

            console.log({ filters })

            const result = await GetReembolsosPaginateService.execute(setPage, setLimit, filters)
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

    async updateReembolso(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const reembolsoData: IReembolso = req.body;
            const result = await UpdateReembolsoService.execute(id, reembolsoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new ReembolsoController()