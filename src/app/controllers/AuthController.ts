import { NextFunction, Request, Response } from "express";
import LoginService from '../services/Auth/Login'
import LogoutService from '../services/Auth/Logout'
import { IAuth } from "../interfaces/Auth/IAuth";

class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req
            const { username, password } = body

            const dataAuth: IAuth = {
                username,
                password
            }

            const result = await LoginService.execute(dataAuth)
            res.status(result.status || 200).json(result)
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
}

export default new AuthController()