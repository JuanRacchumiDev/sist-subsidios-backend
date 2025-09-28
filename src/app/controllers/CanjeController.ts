import { NextFunction, Response, Request } from "express";
import GetCanjesService from '../services/Canje/GetCanjes'
import GetCanjeService from '../services/Canje/GetCanje'
import CreateCanjeService from '../services/Canje/CreateCanje'
import UpdateCanjeService from '../services/Canje/UpdateCanje'
import { ICanje } from "../interfaces/Canje/ICanje";
import GetCanjesPaginateService from "../services/Canje/GetCanjesPaginate";
import { ICanjeFilter } from "../interfaces/Canje/ICanjeFilter";

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

            // Extracción de filtros opcionales de req.query
            const {
                nombre_colaborador,
                codigo_canje,
                codigo_citt,
                fecha_inicio_subsidio,
                fecha_final_subsidio,
                estado
            } = req.query;

            // Construir el objeto de filtros (maneja el estado como booleano si es necesario)
            const filters: ICanjeFilter = {
                nombre_colaborador: nombre_colaborador as string,
                codigo_canje: codigo_canje as string,
                codigo_citt: codigo_citt as string,
                fecha_inicio_subsidio: fecha_inicio_subsidio as string,
                fecha_final_subsidio: fecha_final_subsidio as string,
                estado: estado !== undefined ? estado === 'true' : undefined // Convierte 'true'/'false' a booleano, o undefined si no está
            };

            const result = await GetCanjesPaginateService.execute(page, limit, filters)

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