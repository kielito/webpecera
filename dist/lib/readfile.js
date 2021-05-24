"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    var results=[];
    req.session.datos_csv=[];
       
    fs.createReadStream("ejemplo.csv") // Abrir archivo
        .pipe(csv({ separator: ';' })) // Pasarlo al parseador a través de una tubería
        .on('data', (row) => req.session.datos_csv.push(row) )
        .on("end", () => {// Y al finalizar, terminar lo necesario
            console.log("Se ha terminado de leer el archivo");
            console.log(req.session.datos_csv);

    });

    next();
}   */
//# sourceMappingURL=readfile.js.map