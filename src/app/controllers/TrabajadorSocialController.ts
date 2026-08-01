import GetTrabajadoresSocialesService from "../services/TrabajadorSocial/GetTrabajadoresSociales";
import GetTrabajadorSocialService from "../services/TrabajadorSocial/GetTrabajadorSocial"
import GetTrabajadoresSocialesPaginateService from "../services/TrabajadorSocial/GetTrabajadoresSocialesPaginate"
import CreateTrabajadorSocialService from "../services/TrabajadorSocial/CreateTrabajadorSocial"
import UpdateTrabajadorSocialService from "../services/TrabajadorSocial/UpdateTrabajadorSocial"
import DeleteTrabajadorSocialService from "../services/TrabajadorSocial/DeleteTrabajadorSocial"
import GetTrabajadorSocialByIdTipoDocAndNumDocService from '../services/TrabajadorSocial/GetByTipoDocAndNumDoc'
import { NextFunction, Request, Response } from "express";
import { ITrabajadorSocial } from "../interfaces/TrabajadorSocial/ITrabajadorSocial";
import { ITrabajadorSocialFilter } from "../interfaces/TrabajadorSocial/ITrabajadorSocialFilter";

class TrabajadorSocialController {
    async getTrabajadoresSociales(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetTrabajadoresSocialesService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllTrabajadoresSocialesPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const {
                query: {
                    page,
                    limit,
                    id_tipodocumento,
                    id_empresa,
                    id_cargo,
                    numero_documento,
                    nombre_completo
                }
            } = req

            const setPage = parseInt(page as string) || 1

            const setLimit = parseInt(limit as string) || 10

            // Construir el objeto de filtros
            const filters: ITrabajadorSocialFilter = {
                id_tipodocumento: id_tipodocumento as string,
                id_empresa: id_empresa as string,
                id_cargo: id_cargo as string,
                numero_documento: numero_documento as string,
                nombre_completo: nombre_completo as string
            }

            const result = await GetTrabajadoresSocialesPaginateService.execute(setPage, setLimit, filters)

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

    async getTrabajadorSocialByIdTipoDocAndNumDoc(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { idTipoDoc, numDoc } } = req

            if (!idTipoDoc || !numDoc) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El tipo de documento y número de documento son requeridos como parámetros de consulta'
                    }
                );
            }

            const idTipoDocStr = idTipoDoc as string
            const numDocStr = numDoc as string

            const result = await GetTrabajadorSocialByIdTipoDocAndNumDocService.execute(idTipoDocStr, numDocStr)
            // res.status(result.status || 200).json(result)
            if (result.status === 500) {
                res.status(result.status).json(result)
            }
            res.status(200).json(result)
        } catch (error) {
            next(error)
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