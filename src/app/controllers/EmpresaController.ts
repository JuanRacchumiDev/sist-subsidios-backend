import { Request, Response, NextFunction } from 'express'
import GetEmpresasService from '../services/Empresa/GetEmpresas'
import GetEmpresasPaginateService from '../services/Empresa/GetEmpresasPaginate'
import GetEmpresaService from '../services/Empresa/GetEmpresa'
import GetInfoApiService from '../services/Empresa/GetInfoApi'
import CreateEmpresaService from '../services/Empresa/CreateEmpresa'
import UpdateEmpresaService from '../services/Empresa/UpdateEmpresa'
import DeleteEmpresaService from '../services/Empresa/DeleteEmpresa'
import { IEmpresa } from '../interfaces/Empresa/IEmpresa'

class EmpresaController {
    async getEmpresaByApi(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { ruc } } = req

            if (!ruc) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El ruc es requerido como parámetro de consulta',
                        status: 400
                    }
                );
            }

            const rucStr = ruc as string

            const result = await GetInfoApiService.execute(rucStr)

            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllEmpresas(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetEmpresasService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllEmpresasPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1

            const limit = parseInt(req.query.limit as string) || 10

            // Extracción de filtros opcionales de req.query
            const filter = req.query.filter as string || ""

            const result = await GetEmpresasPaginateService.execute(page, limit, filter)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getEmpresaById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetEmpresaService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createEmpresa(req: Request, res: Response, next: NextFunction) {
        try {
            const empresaData: IEmpresa = req.body;
            const result = await CreateEmpresaService.execute(empresaData);
            res.status(result.status || 201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateEmpresa(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const empresaData: IEmpresa = req.body;
            const result = await UpdateEmpresaService.execute(id, empresaData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async deleteEmpresa(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteEmpresaService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new EmpresaController()