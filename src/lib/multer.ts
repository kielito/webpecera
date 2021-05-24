import {Request, Response, NextFunction} from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import productModel from '../models/productModel';
import multers from 'multer';

/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
       cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
       fs.createReadStream
    }
  });

export function leerCSVSchema(req: Request, res:Response, next:NextFunction) {    
    const storage = multers.diskStorage({
    destination: (req, file, cb) => {
       cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
        }
    });   
   
    const upload = multers({storage: storage});
    next();
}   */