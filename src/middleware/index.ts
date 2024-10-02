import { Request, Response, NextFunction } from "express"
import { check, validationResult } from "express-validator"

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {

    console.log("Datos recibidos:", req.body);

    let errors = validationResult(req)
    if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})}

    //Este next es necesario para continuar con la siguiente funcion del router
    next()
    //Esto es para hacerlo reutilizable
}