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
const clientModel_1 = __importDefault(require("../models/clientModel"));
class ClientController {
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const clientes = yield clientModel_1.default.listar();
            console.log(clientes);
            return res.json(clientes);
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const cliente = yield clientModel_1.default.buscarId(id);
            if (cliente)
                return res.json(cliente);
            res.status(404).json({ text: "Client doesn't exists" });
        });
    }
    addClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cliente = req.body;
            const busqueda = yield clientModel_1.default.buscarCliente(cliente.NumeroDocumento);
            if (!busqueda) {
                const result = yield clientModel_1.default.crear(cliente);
                req.flash('confirmacion', 'Cliente registrado correctamente!');
                return res.redirect("../control");
            }
            req.flash('error', 'El cliente ya se encuentra registrado!');
            return res.redirect("../control");
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield clientModel_1.default.actualizar(req.body, id);
            req.flash('confirmacion', 'Cliente actualizado correctamente!');
            return res.redirect("../control");
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield clientModel_1.default.eliminar(id);
            req.flash('confirmacion', 'Cliente eliminado correctamente!');
            return res.redirect("../control");
        });
    }
    //FIN CRUD	
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientes = yield clientModel_1.default.listar();
            const telefonos = yield clientModel_1.default.listarTelefonos();
            console.log(telefonos);
            res.render('partials/cliente/clients', { clients: clientes, telefono: telefonos });
        });
    }
    mostrarUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const cliente = yield clientModel_1.default.buscarId(id);
            if (cliente !== undefined) {
                res.render("partials/cliente/update", { cliente });
            }
        });
    }
}
const clientController = new ClientController();
exports.default = clientController;
//# sourceMappingURL=clientController.js.map