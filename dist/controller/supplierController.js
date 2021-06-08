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
    add(req, res) {
        res.render("partials/proveedor/alta");
    }
    addSupplier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const proveedor = req.body;
            const telefono = {
                Numero: proveedor.Numero,
                Tipo: proveedor.Tipo,
                Principal: "Si",
                IdProveedor: ""
            };
            delete proveedor.Numero;
            delete proveedor.Tipo;
            const busqueda = yield supplierModel_1.default.buscarProveedor(proveedor.RazonSocial); // Hace referencia al campo Usuario de la tabla usuario.
            if (!busqueda) {
                telefono.IdProveedor = yield supplierModel_1.default.crear(proveedor);
                yield supplierModel_1.default.crearTelefono(telefono);
                req.flash('confirmacion', 'Proveedor registrado correctamente!');
                return res.redirect("../control");
            }
            req.flash('error', 'El proveedor ya se encuentra registrado!');
            return res.redirect("../control");
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cliente = req.body;
            if (cliente.Numero instanceof Array) {
                for (let i = 0; i < cliente.Numero.length; i++) {
                    const telefono = {
                        Numero: cliente.Numero[i],
                        Tipo: cliente.Tipo[i]
                    };
                    yield supplierModel_1.default.actualizarTelefono(telefono, cliente.Id[i]);
                }
            }
            else {
                let telefono = {
                    Numero: cliente.Numero,
                    Tipo: cliente.Tipo
                };
                yield supplierModel_1.default.actualizarTelefono(telefono, cliente.Id);
            }
            delete cliente.Numero;
            delete cliente.Tipo;
            delete cliente.Id;
            yield supplierModel_1.default.actualizar(cliente, id);
            req.flash('confirmacion', 'Proveedor actualizado correctamente!');
            return res.redirect("../control");
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield supplierModel_1.default.eliminar(id);
            req.flash('confirmacion', 'Proveedor eliminado correctamente!');
            return res.redirect("../control");
        });
    }
    //FIN CRUD
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const proveedores = yield supplierModel_1.default.listar();
            res.render('partials/proveedor/proveedores', { supplier: proveedores });
        });
    }
    mostrarUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const proveedor = yield supplierModel_1.default.buscarId(id);
            const telefonos = yield supplierModel_1.default.buscarIdTelefono(id);
            if (proveedor !== undefined) {
                res.render("partials/proveedor/edicion", { proveedor, telefono: telefonos });
            }
        });
    }
}
const supplierController = new SupplierController();
exports.default = supplierController;
//# sourceMappingURL=supplierController.js.map