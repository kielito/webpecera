"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierController_1 = __importDefault(require("../controller/supplierController")); //ruta relativa
class SupplierRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //se asocian rutas con el metodo de una clase existente:
        this.router.get('/', (req, res) => {
            res.send('Suppliers!!!');
            //res.render("partials/principal");               
        });
        //CRUD
        this.router.get('/list', supplierController_1.default.list);
        this.router.get('/find/:id', supplierController_1.default.find);
        this.router.post('/add', supplierController_1.default.addSupplier);
        this.router.put('/update/:id', supplierController_1.default.update);
        this.router.delete('/delete/:id', supplierController_1.default.delete);
        // FIN CRUD
        this.router.get('/control', supplierController_1.default.control);
    }
}
//Exportamos el enrutador con 
const supplierRoutes = new SupplierRoutes();
exports.default = supplierRoutes.router;
//# sourceMappingURL=supplierRoutes.js.map