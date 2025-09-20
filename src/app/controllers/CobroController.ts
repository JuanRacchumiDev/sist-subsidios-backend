import { Request, Response, NextFunction } from 'express'
import CreateCobroService from '../services/Cobro/CreateCobro'
import DeleteCobroService from '../services/Cobro/DeleteCobro'
import GetCobroService from '../services/Cobro/GetCobro'
import GetCobrosService from '../services/Cobro/GetCobros'
import GetCobrosPaginateService from '../services/Cobro/GetCobrosPaginate'
import UpdateCobroService from '../services/Cobro/UpdateCobro'
import { ICobro } from '../interfaces/Cobro/ICobro';

class CobroController {
    async getAllCobros(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetCobrosService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllCobrosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            const result = await GetCobrosPaginateService.execute(page, limit)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getCobroById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetCobroService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createCobro(req: Request, res: Response, next: NextFunction) {
        try {
            const payload: ICobro = req.body;
            const result = await CreateCobroService.execute(payload);
            // res.status(result.status || 201).json(result);
            const { status: statusCobro } = result
            if (statusCobro === 201) {
                res.status(statusCobro).json(result)
            }
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }

    async updateCobro(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const payload: ICobro = req.body;
            const result = await UpdateCobroService.execute(id, payload);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteCobro(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteCobroService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new CobroController()