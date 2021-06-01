"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supplierModel_1 = __importDefault(require("../models/supplierModel"));
class SupplierController {
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const proveedores = yield supplierModel_1.default.listar();
            console.log(proveedores);
            return res.json(proveedores);
            //res.send('Listado de clientes!!!');
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const proveedores = yield supplierModel_1.default.buscarId(id);
            if (proveedores)
                return res.json(proveedores);
            res.status(404).json({ text: "Supplier doesn't exists" });
        });
    }
    addSupplier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const proveedor = req.body;
            console.log(req.body);
            //res.send('Proveedor agregado!!!');
            const busqueda = yield supplierModel_1.default.buscarProveedor(proveedor.RazonSocial); // Hace referencia al campo Usuario de la tabla usuario.
            if (!busqueda) {
                const result = yield supplierModel_1.default.crear(proveedor);
                req.flash('confirmacion', 'Proveedor registrado correctamente!');
                return res.redirect("../supplier/control");
            }
            req.flash('error', 'El proveedor ya se encuentra registrado!');
            return res.redirect("../supplier/control");
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params;
            const result = yield supplierModel_1.default.actualizar(req.body, id);
            //res.send('Proveedor '+ req.params.id +' actualizado!!!');
            req.flash('confirmacion', 'Proveedor actualizado correctamente!');
            return res.redirect("../control");
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            //res.send('Proveedor '+ req.params.id +' Eliminado!!!');
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield supplierModel_1.default.eliminar(id);
            req.flash('confirmacion', 'Proveedor eliminado correctamente!');
            return res.redirect("../control");
        });
    }
    //FIN CRUD
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //res.send('Controles');
            const proveedores = yield supplierModel_1.default.listar();
            res.render('partials/proveedor/proveedores', { supplier: proveedores });
        });
    }
    mostrarUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const proveedor = yield supplierModel_1.default.buscarId(id);
            if (proveedor !== undefined) {
                res.render("partials/proveedor/update", { proveedor });
            }
        });
    }
}
const supplierController = new SupplierController();
exports.default = supplierController;
//# sourceMappingURL=supplierController.js.map