import GetColaboradoresService from "../services/Colaborador/GetColaboradores";
import GetColaboradorService from "../services/Colaborador/GetColaborador"
import GetColaboradoresPaginateService from "../services/Colaborador/GetColaboradoresPaginate"
import CreateColaboradorService from "../services/Colaborador/CreateColaborador"
import UpdateColaboradorService from "../services/Colaborador/UpdateColaborador"
import DeleteColaboradorService from "../services/Colaborador/DeleteColaborador"
import GetColaboradoresByEmpresaService from "../services/Colaborador/GetColaboradoresByIdEmpresa"
import GetByIdTipoAndNumDocService from "../services/Colaborador/GetByIdTipoAndNumDoc"
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

    async getAllColaboradoresPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10
            const estadoParam = req.query.estado
            let estado: boolean | undefined

            if (typeof estadoParam === 'string') {
                estado = estadoParam.toLowerCase() === 'true'
            }

            const result = await GetColaboradoresPaginateService.execute(page, limit, estado)
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

    async getColaboradorByIdTipoDocAndNumDoc(req: Request, res: Response, next: NextFunction) {
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

            const result = await GetByIdTipoAndNumDocService.execute(idTipoDocStr, numDocStr)

            if (result.status === 500) {
                res.status(result.status).json(result)
            }
            res.status(200).json(result)

        } catch (error) {
            next(error);
        }
    }

    async getColaboradoresByIdEmpresa(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { idEmpresa } } = req

            if (!idEmpresa) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El identificador de una empresa es requerido como parámetro de consulta'
                    }
                );
            }

            const idEmpresaStr = idEmpresa as string

            const result = await GetColaboradoresByEmpresaService.execute(idEmpresaStr)

            if (result.status === 500) {
                res.status(result.status).json(result)
            }
            res.status(200).json(result)

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