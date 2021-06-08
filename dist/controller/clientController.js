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
    add(req, res) {
        res.render("partials/cliente/alta");
    }
    addClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cliente = req.body;
            const telefono = {
                Numero: cliente.Numero,
                Tipo: cliente.Tipo,
                Principal: "Si",
                IdCliente: ""
            };
            delete cliente.Numero;
            delete cliente.Tipo;
            const busqueda = yield clientModel_1.default.buscarCliente(cliente.NumeroDocumento);
            if (!busqueda) {
                telefono.IdCliente = yield clientModel_1.default.crear(cliente);
                yield clientModel_1.default.crearTelefono(telefono);
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
            const cliente = req.body;
            if (cliente.Numero instanceof Array) {
                for (let i = 0; i < cliente.Numero.length; i++) {
                    const telefono = {
                        Numero: cliente.Numero[i],
                        Tipo: cliente.Tipo[i]
                    };
                    yield clientModel_1.default.actualizarTelefono(telefono, cliente.Id[i]);
                }
            }
            else {
                let telefono = {
                    Numero: cliente.Numero,
                    Tipo: cliente.Tipo
                };
                yield clientModel_1.default.actualizarTelefono(telefono, cliente.Id);
            }
            delete cliente.Numero;
            delete cliente.Tipo;
            delete cliente.Id;
            yield clientModel_1.default.actualizar(cliente, id);
            req.flash('confirmacion', 'Cliente actualizado correctamente!');
            return res.redirect("../control");
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield clientModel_1.default.eliminarTelefono(id);
            yield clientModel_1.default.eliminar(id);
            req.flash('confirmacion', 'Cliente eliminado correctamente!');
            return res.redirect("../control");
        });
    }
    //FIN CRUD	
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientes = yield clientModel_1.default.listar();
            const telefonos = yield clientModel_1.default.listarTelefonos();
            res.render('partials/cliente/clientes', { clients: clientes, telefono: telefonos });
        });
    }
    mostrarUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const clientes = yield clientModel_1.default.buscarId(id);
            const telefonos = yield clientModel_1.default.buscarIdTelefono(id);
            if (clientes !== undefined) {
                res.render("partials/cliente/update", { cliente: clientes, telefono: telefonos });
            }
        });
    }
}
const clientController = new ClientController();
exports.default = clientController;
//# sourceMappingURL=clientController.js.map