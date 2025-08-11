import GetColaboradoresService from "../services/Colaborador/GetColaboradores";
import GetColaboradorService from "../services/Colaborador/GetColaborador"
import CreateColaboradorService from "../services/Colaborador/CreateColaborador"
import UpdateColaboradorService from "../services/Colaborador/UpdateColaborador"
import DeleteColaboradorService from "../services/Colaborador/DeleteColaborador"
import { NextFunction, Request, Response } from "express";
import { IColaborador } from "../interfaces/Colaborador/IColaborador";

class ColaboradorController {
    async getColaboradores(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetColaboradoresService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getColaboradorById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetColaboradorService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createColaborador(req: Request, res: Response, next: NextFunction) {
        try {
            const colaboradorData: IColaborador = req.body;
            const result = await CreateColaboradorService.execute(colaboradorData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateColaborador(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const colaboradorData: IColaborador = req.body;
            const result = await UpdateColaboradorService.execute(id, colaboradorData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteColaborador(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteColaboradorService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new ColaboradorController()