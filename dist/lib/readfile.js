"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerCSVSchema = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, __basedir + '/uploads/')
    },
    filename: (req, file, cb) => {
       cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
       fs.createReadStream
    }
  });*/
function leerCSVSchema(req, res, next) {
    var results = [];
    req.session.datos_csv = [];
    fs_1.default.createReadStream("ejemplo.csv") // Abrir archivo
        .pipe(csv_parser_1.default({ separator: ';' })) // Pasarlo al parseador a través de una tubería
        .on('data', (row) => req.session.datos_csv.push(row))
        .on("end", () => {
        console.log("Se ha terminado de leer el archivo");
        console.log(req.session.datos_csv);
    });
    next();
}
exports.leerCSVSchema = leerCSVSchema;
//# sourceMappingURL=readfile.js.map