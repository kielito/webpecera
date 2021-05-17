import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { NumericLiteral } from 'typescript';

interface IPayload {
    _id: string;
    iat: number;
    exp: number;
}

export const TokenValidation = async (req: Request, res: Response, next: NextFunction) => {    
    
    const token = await req.header('auth-token');

    /*const authHeader = req.headers.authorization;
    console.log(authHeader);*/
    
    if(!token) return res.status(401).json('Acceso denegado');
    
    try {
        //const token = authHeader.split(' ')[1];

        const payload = await jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest') as IPayload;
        console.log(payload);
        req.userdId = payload._id;
        
        next();

    } catch(error) {
        return res.status(401).json({message: 'Token invalido!'});
    }
}