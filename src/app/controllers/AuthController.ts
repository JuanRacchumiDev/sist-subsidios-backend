import { NextFunction, Request, Response } from "express";
import LoginService from '../services/Auth/Login'
import LogoutService from '../services/Auth/Logout'
import CreateCodigoTempService from '../services/Auth/CreateCodigoTemp'
import { AuthCredenciales } from '../types/Auth/TAuth'

class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req

            const { email, password } = body

            const dataAuth: AuthCredenciales = {
                email,
                password
            }

            const result = await LoginService.execute(dataAuth)
            // res.status(result.status || 200).json(result)

            const { status } = result

            if (status === 500) {
                res.status(status).json(result)
            }
            res.status(200).json(result)

        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req
            const { id: usuarioId } = body

            const result = await LogoutService.execute(usuarioId)
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async createCodigoTemp(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await CreateCodigoTempService.execute()
            res.status(result.status || 200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController()