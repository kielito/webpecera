"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerCSVSchema = void 0;
const multer_1 = __importDefault(require("multer"));
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
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __basedir + '/uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
        }
    });
    const upload = multer_1.default({ storage: storage });
    next();
}
exports.leerCSVSchema = leerCSVSchema;
//# sourceMappingURL=muler.js.map