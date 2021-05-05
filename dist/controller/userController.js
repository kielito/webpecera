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
const userModel_1 = __importDefault(require("../models/userModel"));
class UserController {
    signin(req, res) {
        res.render("partials/signinForm");
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, password } = req.body;
            const result = yield userModel_1.default.buscarNombre(usuario);
            if (!result)
                return res.status(400).json('User no exists!!');
            const correctPassword = yield userModel_1.default.validarPassword(password, result.Password);
            if (correctPassword) {
                //JWT
                /*const token: string = jwt.sign({_id: result.Id}, process.env.TOKEN_SECRET || 'tokentest', {
                    expiresIn: '1d' //vence en un dia
                })
    
                process.env.token_user = token;
                req.headers.authorization = process.env.token_user;
                
                console.log(token);
                
                res.header('auth-token', process.env.token_user);
                res.redirect("./home");
                return;*/
                //JWT
                //CORRECTO!            
                res.redirect("./home");
                //res.render('partials/home');
                return;
            }
            return res.status(400).json('Clave Incorrecta!!');
        });
    }
    //REGISTRO
    signup(req, res) {
        res.render("partials/signupForm");
    }
    home(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //JWT
            /*res.header('Authorization', process.env.token_user);
            console.log(process.env.token_user)
            console.log(req.header('auth-token'))*/
            const usuarios = yield userModel_1.default.listar();
            res.render('partials/home', { users: usuarios });
        });
    }
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield userModel_1.default.listar();
            return res.json(usuarios);
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            if (usuario)
                return res.json(usuario);
            res.status(404).json({ text: "User doesn't exists" });
        });
    }
    addUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuario = req.body;
            delete usuario.repassword;
            usuario.password = yield userModel_1.default.encriptarPassword(usuario.password);
            const busqueda = yield userModel_1.default.buscarNombre(usuario.usuario);
            if (!busqueda) {
                const result = yield userModel_1.default.crear(usuario);
                return res.json({ message: 'User saved!!' });
            }
            return res.json({ message: 'User existsss!!' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            if (req.body.password === "") {
                return res.json({ message: 'La clave no puede estar vacía!' });
            }
            if (req.body.rol === "") {
                return res.json({ message: 'Debe seleccionar un Nuevo Rol!' });
            }
            else {
                req.body.password = yield userModel_1.default.encriptarPassword(req.body.password);
                const result = yield userModel_1.default.actualizar(req.body, id);
                if (result) {
                    return res.json({ message: 'Usuario actualizado correctamente!' });
                }
                return res.json({ message: 'El usuario y/o email ya se encuentra registrado!' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield userModel_1.default.eliminar(id);
            const usuarios = yield userModel_1.default.listar();
            res.render('partials/controls', { users: usuarios });
        });
    }
    //FIN CRUD
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield userModel_1.default.listar();
            const users = usuarios;
            res.render('partials/controls', { users: usuarios });
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const usuario = yield userModel_1.default.buscarId(id);
            if (usuario !== undefined) {
                res.render("partials/update", { usuario });
            }
        });
    }
}
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map