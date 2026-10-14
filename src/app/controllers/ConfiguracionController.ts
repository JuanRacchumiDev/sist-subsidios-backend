import { Request, Response, NextFunction } from 'express'
import CreateConfiguracionService from '../services/Configuracion/CreateConfiguracion'
import GetConfiguracionesService from '../services/Configuracion/GetConfiguraciones'
import GetConfiguracionService from '../services/Configuracion/GetConfiguracion'
import GetConfiguracionesPaginateService from '../services/Configuracion/GetConfiguracionesPaginate'
import UpdateConfiguracionService from '../services/Configuracion/UpdateConfiguracion'
import { IConfiguracion } from '../interfaces/Configuracion/IConfiguracion';

class ConfiguracionController {
    async getAllConfiguraciones(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await GetConfiguracionesService.execute()

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error) // Pasa al error al middleware de manejo de errores
        }
    }

    async getAllConfiguracionesPaginated(req: Request, res: Response, next: NextFunction) {
        try {
            const { query: { page, limit } } = req

            const setPage = parseInt(page as string) || 1

            const setLimit = parseInt(limit as string) || 10

            const result = await GetConfiguracionesPaginateService.execute(setPage, setLimit)

            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getConfiguracionById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const result = await GetConfiguracionService.execute(id);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async createConfiguracion(req: Request, res: Response, next: NextFunction) {
        try {
            const payload: IConfiguracion = req.body;
            const result = await CreateConfiguracionService.execute(payload);
            const { status: statusCobro } = result

            if (statusCobro === 201) {
                res.status(statusCobro).json(result)
            }
            res.status(200).json(result)
        } catch (error) {
            next(error);
        }
    }

    async updateConfiguracion(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const payload: IConfiguracion = req.body;
            const result = await UpdateConfiguracionService.execute(id, payload);
            res.status(result.status || 200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new ConfiguracionController()