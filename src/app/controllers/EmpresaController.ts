import { Request, Response, NextFunction } from 'express'
import CreateEmpresaService from '../services/Empresa/CreateEmpresa'
import GetEmpresasService from '../services/Empresa/GetEmpresas'
import GetInfoApiService from '../services/Empresa/GetInfoApi'

class EmpresaController {
    async getEmpresaByApi(req: Request, res: Response, next: NextFunction) {
        try {
            const { params } = req
            const { ruc } = params

            const result = await GetInfoApiService.execute(ruc)

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
}

export default new EmpresaController()