//Para especiaficar como extiendo una interface

declare namespace Express {
    export interface Request {
        userdId: string; //le agrego al Request un nuevo objeto userId
    }
}