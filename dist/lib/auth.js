"use strict";
/*import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({message: 'Token requerido!'});
    }
    else{
        const token = authHeader.split(' ')[1];

        try {
            await jwt.verify(token, process.env.TOKEN_SECRET || 'tokentest');
            next();
        } catch(error) {
            return res.status(401).json({message: 'Token invalido!'});
        }
    }
}*/ 
//# sourceMappingURL=auth.js.map