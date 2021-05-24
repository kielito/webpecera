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
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientes = yield clientModel_1.default.listar();
            const clients = clientes;
            res.render('partials/cliente/clients', { clients: clientes });
        });
    }
    controlUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render('partials/cliente/clients');
        });
    }
    //CRUD
    addClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const cliente = req.body;
            delete cliente.repassword;
            const busqueda = yield clientModel_1.default.buscarCliente(cliente.NumeroDocumento);
            if (!busqueda) {
                const result = yield clientModel_1.default.crear(cliente);
                return res.json({ message: 'Client saved!!' });
            }
            return res.json({ message: 'Client exists!!' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield clientModel_1.default.actualizar(req.body, id);
            return res.json({ text: 'updating a client ' + id });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield clientModel_1.default.eliminar(id);
            return res.json({ text: 'deleting a client ' + id });
        });
    }
}
const clientController = new ClientController();
exports.default = clientController;
//# sourceMappingURL=clientController.js.map