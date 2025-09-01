import { IRepresentanteLegal } from "../interfaces/RepresentanteLegal/IRepresentanteLegal";
import CreateRepresentanteService from "../services/RepresentanteLegal/CreateRepresentante";
import DeleteRepresentanteService from "../services/RepresentanteLegal/DeleteRepresentante";
import GetByTipoDocAndNumDocService from "../services/RepresentanteLegal/GetByTipoDocAndNumDoc";
import GetRepresentanteService from "../services/RepresentanteLegal/GetRepresentante";
import GetRepresentantesService from "../services/RepresentanteLegal/GetRepresentantes";
import UpdateRepresentanteService from "../services/RepresentanteLegal/UpdateRepresentante";
import { NextFunction, Request, Response } from "express";

class RepresentanteLegalController {
    async getRepresentantes(req: Request, res: Response, next: NextFunction) {
        try {
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetRepresentantesService.execute(estado)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getRepresentanteById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetRepresentanteService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getRepresentanteByIdTipoDocAndNumDoc(req: Request, res: Response, next: NextFunction) {
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

            const result = await GetByTipoDocAndNumDocService.execute(idTipoDocStr, numDocStr)
            // res.status(result.status || 200).json(result)
            if (result.status === 500) {
                res.status(result.status).json(result)
            }
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async createRepresentante(req: Request, res: Response, next: NextFunction) {
        try {
            const payload: IRepresentanteLegal = req.body;
            const result = await CreateRepresentanteService.execute(payload);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateRepresentante(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const payload: IRepresentanteLegal = req.body;
            const result = await UpdateRepresentanteService.execute(id, payload);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteRepresentante(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteRepresentanteService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new RepresentanteLegalController()