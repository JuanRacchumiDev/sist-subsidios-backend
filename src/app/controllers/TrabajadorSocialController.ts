import GetTrabajadoresSocialesService from "../services/TrabajadorSocial/GetTrabajadoresSociales";
import GetTrabajadorSocialService from "../services/TrabajadorSocial/GetTrabajadorSocial"
import CreateTrabajadorSocialService from "../services/TrabajadorSocial/CreateTrabajadorSocial"
import UpdateTrabajadorSocialService from "../services/TrabajadorSocial/UpdateTrabajadorSocial"
import DeleteTrabajadorSocialService from "../services/TrabajadorSocial/DeleteTrabajadorSocial"
import { NextFunction, Request, Response } from "express";
import { ITrabajadorSocial } from "@/interfaces/TrabajadorSocial/ITrabajadorSocial";

class TrabajadorSocialController {
    async getTrabajadoresSociales(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetTrabajadoresSocialesService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getTrabajadorSocialById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetTrabajadorSocialService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createTrabajadorSocial(req: Request, res: Response, next: NextFunction) {
        try {
            const trabSocialData: ITrabajadorSocial = req.body;
            const result = await CreateTrabajadorSocialService.execute(trabSocialData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateTrabajadorSocial(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const trabSocialData: ITrabajadorSocial = req.body;
            const result = await UpdateTrabajadorSocialService.execute(id, trabSocialData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteTrabajadorSocial(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteTrabajadorSocialService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new TrabajadorSocialController()