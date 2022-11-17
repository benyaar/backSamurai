import {Request, Response, Router} from "express";
import {loginInputValidation, registrationValidation} from "../middleware/expressValidator";
import {authService} from "../domain/authService";
import {bearerAuthMiddleWare} from "../middleware/bearerAuthMiddleWare";
import {queryRepository} from "../queryRepository/queryRepository";
import {UserAboutInfoType} from "../types/types";
import {usersService} from "../domain/usersService";
import {attemptsMiddleware} from "../middleware/attempsMiddleware";

export const authRouter = Router({})

authRouter.post('/login', loginInputValidation, attemptsMiddleware, async (req:Request, res:Response) =>{
    const login = req.body.login
    const password = req.body.password

    const loginUser = await authService.loginUser(login, password)

    if(!loginUser) return res.sendStatus(401)


    res.status(200).send({'accessToken': loginUser})
})
authRouter.get('/me', bearerAuthMiddleWare, async (req:Request, res:Response) =>{
    const user = req.user!.id
    const userInfo = await queryRepository.findUserById(user)
    if(!userInfo) return res.status(404)
    const userAbout: UserAboutInfoType = {
        email: userInfo?.email,
        login: userInfo?.login,
        userId: userInfo?.id,
    }

    res.status(200).send(userAbout)
})

authRouter.post('/registration', registrationValidation, async (req: Request, res: Response) => {
    const login = req.body.login
    const password = req.body.password
    const email = req.body.email

    const findUserBuLoginOrEmail = await queryRepository.findUserByLoginOrEmail(login, email)
    if(findUserBuLoginOrEmail) return res.sendStatus(404)

    const createNewUser = await usersService.createNewUser(login, email, password)
    if(!createNewUser) return res.sendStatus(404)
    res.sendStatus(204)
})

authRouter.post('/registration-confirmation', async (req:Request, res:Response)=>{
    const confirmaionCode = req.body.code
    const findUserByCode = await queryRepository.findUserByCode(confirmaionCode)
    if(!findUserByCode) return res.sendStatus(404)
})