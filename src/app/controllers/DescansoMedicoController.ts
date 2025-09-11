import { NextFunction, Response, Request } from "express";
import GetDescansosService from '../services/DescansoMedico/GetDescansos'
import GetDescansoService from '../services/DescansoMedico/GetDescanso'
import GetDescansosPaginateService from '../services/DescansoMedico/GetDescansosPaginate'
import CreateDescansoService from '../services/DescansoMedico/CreateDescanso'
import UpdateDescansoService from '../services/DescansoMedico/UpdateDescanso'
import { IDescansoMedico } from "../interfaces/DescansoMedico/IDescansoMedico";

class DescansoMedicoController {
    async getAllDescansos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetDescansosService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllDescansosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetDescansosPaginateService.execute(page, limit, estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getDescansoById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetDescansoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createDescanso(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('parámetros new descanso médico', req.body)
            const descansoData: IDescansoMedico = req.body;
            const result = await CreateDescansoService.execute(descansoData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateDescanso(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const descansoData: IDescansoMedico = req.body;
            const result = await UpdateDescansoService.execute(id, descansoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new DescansoMedicoController()