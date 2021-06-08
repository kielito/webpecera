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
        res.render("partials/user/signinForm");
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { usuario, password } = req.body;
            const result = yield userModel_1.default.buscarNombre(usuario);
            if (!result) {
                req.flash('error', 'El Usuario no se encuentra registrado');
                return res.redirect("./signin");
            }
            else {
                const correctPassword = yield userModel_1.default.validarPassword(password, result.Password);
                if (correctPassword) {
                    //JWT
                    /*const token: string = jwt.sign({_id: result.Id}, process.env.TOKEN_SECRET || 'tokentest', {
                        expiresIn: '1d' //vence en un dia
                    })
    
                    //process.env.token_user = token;
                    //req.headers.authorization = process.env.token_user;
                    
                    //console.log(token);
                    
                    res.header('auth-token', token);
                    //res.render('partials/home');
                    res.redirect("./home");
                    return;*/
                    //JWT
                    //CORRECTO!
                    req.session.user = result;
                    req.session.auth = true;
                    req.flash('confirmacion', 'Bienvenido ' + result.Nombre + '!!');
                    res.redirect("./home");
                    //res.render('partials/home');
                    return;
                }
                else {
                    req.flash('error', 'Password Incorrecto');
                    res.redirect("./signin");
                }
            }
        });
    }
    //REGISTRO
    signup(req, res) {
        res.render("partials/user/signupForm");
    }
    home(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //JWT en Authotization
            /*res.header('Authorization', process.env.token_user);
            console.log(process.env.token_user)
            
            console.log(req.header('auth-token'))*/
            //JWT en auth-token
            if (!req.session.auth) {
                req.flash('error', 'Debes iniciar sesion para ver esta seccion!');
                res.redirect("./signin");
            }
            res.render("partials/user/home");
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
            if (usuario.Password.length === 0) {
                req.flash('error', 'Debe ingresar una clave!');
                return res.redirect("./signup");
            }
            if (usuario.Password !== usuario.repassword) {
                req.flash('error', 'Verifique la clave ingresada!');
                return res.redirect("./signup");
            }
            delete usuario.repassword;
            usuario.Password = yield userModel_1.default.encriptarPassword(usuario.Password);
            const busqueda = yield userModel_1.default.buscarNombre(usuario.Usuario);
            if (!busqueda) {
                const result = yield userModel_1.default.crear(usuario);
                if (!result)
                    res.status(404).json({ text: "No se pudo crear el usuario" });
                req.flash('confirmacion', 'Usuario Registrado correctamente!');
                return res.redirect("./users");
            }
            req.flash('error', 'El usuario y/o email ya se encuentra registrado!');
            return res.redirect("./signup");
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debe iniciar sesion para ver esta seccion');
                res.redirect("../signin");
            }
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            console.log(req.body);
            if (req.body.Password !== req.body.repassword) {
                req.flash('error', 'Verifique la clave ingresada!');
                return res.render("partials/user/update", { usuario: req.body, home: req.session.user, mi_session: true });
            }
            delete req.body.repassword;
            req.body.Password = yield userModel_1.default.encriptarPassword(req.body.Password);
            const result = yield userModel_1.default.actualizar(req.body, id);
            if (result) {
                req.flash('confirmacion', 'Usuario "' + req.body.Usuario + '" actualizado correctamente!');
                return res.redirect("../users");
            }
            req.flash('error', 'El usuario y/o email ya se encuentra registrado!');
            return res.render("partials/user/update", { usuario, home: req.session.user, mi_session: true });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debe iniciar sesion para ver esta seccion');
                res.redirect("../signin");
            }
            const { id } = req.params;
            const result = yield userModel_1.default.eliminar(id);
            req.flash('confirmacion', 'Se eliminó el Usuario correctamente!');
            res.redirect('../users');
        });
    }
    //FIN CRUD
    users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debe iniciar sesion para ver esta seccion');
                res.redirect("./signin");
            }
            const usuarios = yield userModel_1.default.listar();
            res.render('partials/user/users', { users: usuarios, mi_session: true });
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debes iniciar sesion para ver esta seccion');
                return res.redirect("../signin");
            }
            const { id } = req.params;
            const usuario = yield userModel_1.default.buscarId(id);
            console.log(usuario);
            if (usuario !== undefined) {
                res.render("partials/user/update", { usuario, home: req.session.user, mi_session: true });
            }
        });
    }
    //METODO PARA CERRAR LA SESION
    endSession(req, res) {
        req.session.user = {}; //Se borran los datos del usuarios guardados en la variable user
        req.session.auth = false; //Se pone autenticado en false
        req.session.destroy(() => console.log("Sesion finalizada")); //Metodo para destruir datos asociados a la sesion
        res.redirect("/");
    }
}
const userController = new UserController();
exports.default = userController;
//# sourceMappingURL=userController.js.map