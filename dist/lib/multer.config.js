"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerCSVSchema = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parse_1 = __importDefault(require("csv-parse"));
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
    const parseador = csv_parse_1.default({
        delimiter: ";",
        cast: true,
        comment: '#' // El carácter con el que comienzan las líneas de los comentarios, en caso de existir
    });
    parseador.on('readable', function () {
        let fila;
        while (fila = parseador.read()) {
            console.log("Tenemos una fila:", fila);
        }
    });
    parseador.on('error', function (err) {
        console.error("Error al leer CSV:", err.message);
    });
    fs_1.default.createReadStream("ejemplo.csv") // Abrir archivo
        .pipe(parseador) // Pasarlo al parseador a través de una tubería
        .on('data', (data) => results.push(data))
        .on("end", function () {
        console.log("Se ha terminado de leer el archivo");
        console.log(results);
        parseador.end();
    });
    next();
}
exports.leerCSVSchema = leerCSVSchema;
//# sourceMappingURL=multer.config.js.map