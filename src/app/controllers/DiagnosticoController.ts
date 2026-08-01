import { Request, Response, NextFunction } from 'express'
import CreateDiagnosticoService from '../services/Diagnostico/CreateDiagnostico'
import DeleteDiagnosticoService from '../services/Diagnostico/DeleteDiagnostico'
import GetDiagnosticoService from '../services/Diagnostico/GetDiagnostico'
import GetDiagnosticosService from '../services/Diagnostico/GetDiagnosticos'
import GetDiagnosticoByNombreService from '../services/Diagnostico/GetByNombre'
import GetDiagnosticosPaginateService from '../services/Diagnostico/GetDiagnosticosPaginate'
import UpdateDiagnosticoService from '../services/Diagnostico/UpdateDiagnostico'
import UpdateEstadoService from '../services/Diagnostico/UpdateEstado'
import { IDiagnostico } from '../interfaces/Diagnostico/IDiagnostico';

class DiagnosticoController {
    async getAllDiagnosticos(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetDiagnosticosService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAllDiagnosticosPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { page, limit, filter } } = req

            const definePage = parseInt(page as string) || 1
            const defineLimit = parseInt(limit as string) || 10

            const defineFilter = filter as string || ""

            const result = await GetDiagnosticosPaginateService.execute(definePage, defineLimit, defineFilter)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getDiagnosticoByCodigo(req: Request, res: Response, next: NextFunction) {
        try {
            const { codigo } = req.params;
            const result = await GetDiagnosticoService.execute(codigo);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getDiagnosticoByNombre(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { nombre } } = req

            if (!nombre) {
                return res.status(400).json(
                    {
                        result: false,
                        message: 'El nombre es requerido como parámetro de consulta',
                        status: 400
                    }
                );
            }

            const nombreStr = nombre as string

            const result = await GetDiagnosticoByNombreService.execute(nombreStr);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createDiagnostico(req: Request, res: Response, next: NextFunction) {
        try {
            const diagnosticoData: IDiagnostico = req.body;
            const result = await CreateDiagnosticoService.execute(diagnosticoData);
            // res.status(result.status || 201).json(result);
            const { status: statusDiagnostico } = result
            if (statusDiagnostico === 201) {
                res.status(statusDiagnostico).json(result)
            }
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }

    async updateDiagnostico(req: Request, res: Response, next: NextFunction) {
        try {
            const { codigo } = req.params;
            const diagnosticoData: IDiagnostico = req.body;
            const result = await UpdateDiagnosticoService.execute(codigo, diagnosticoData);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async updateEstado(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const diagnosticoData: IDiagnostico = req.body
            const result = await UpdateEstadoService.execute(id, diagnosticoData)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async deleteDiagnostico(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await DeleteDiagnosticoService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new DiagnosticoController()