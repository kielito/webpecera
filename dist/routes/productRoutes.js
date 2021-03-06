"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = __importDefault(require("../controller/productController")); //ruta relativa
// import { TokenValidation } from '../lib/verifyToken';
class ProductRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //se asocian rutas con el metodo de una clase existente:
        this.router.get('/', (req, res) => {
            res.render("partials/principal");
        });
        //CRUD
        this.router.get('/list', productController_1.default.list);
        this.router.get('/find/:id', productController_1.default.find);
        this.router.post('/add', productController_1.default.addProduct);
        this.router.get('/update/:id&:codigoProducto&:razonSocial', productController_1.default.mostrarUpdate); //dibujo la vista		
        this.router.post('/update/:id', productController_1.default.updateProductoProveedor);
        this.router.delete('/delete/:id', productController_1.default.delete);
        this.router.get('/delete/:id', productController_1.default.delete);
        this.router.get('/csv', productController_1.default.leerCsv);
        //Carga Archivo Excel
        this.router.get('/upload', productController_1.default.upload);
        this.router.post('/fileupload', productController_1.default.uploadfile);
        this.router.get('/updatecsv', productController_1.default.updateCsv);
        //Fin CRUD
        //CONTROL        
        this.router.get('/control', productController_1.default.control); // renderiza a partials/controls    
        //this.router.post('/procesar',/*TokenValidation,*/ userController.procesar);       
    }
}
const productRoutes = new ProductRoutes();
exports.default = productRoutes.router;
//# sourceMappingURL=productRoutes.js.map