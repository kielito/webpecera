"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controller/userController")); //ruta relativa
const validation_1 = require("../lib/validation");
const register_schema_1 = require("../lib/register-schema");
class UserRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        //se asocian rutas con el metodo de una clase existente:
        this.router.get('/', (req, res) => {
            res.render("partials/principal");
        });
        //Login
        this.router.get('/signin', userController_1.default.signin);
        this.router.post('/signin', userController_1.default.login);
        //this.router.use(auth);
        this.router.get('/signup', userController_1.default.signup);
        this.router.post('/signup', register_schema_1.registerSchema, validation_1.validateRequestSchema, userController_1.default.addUser);
        //Home del usuario		        
        this.router.get('/home', /*TokenValidation,*/ userController_1.default.home);
        this.router.post('/home', /*TokenValidation,*/ userController_1.default.home);
        //CRUD
        this.router.get('/list', userController_1.default.list);
        this.router.get('/find/:id', userController_1.default.find);
        this.router.post('/add', userController_1.default.addUser);
        this.router.get('/update/:id', userController_1.default.procesar); //dibujo la vista		
        this.router.post('/update/:id', userController_1.default.update);
        this.router.delete('/delete/:id', userController_1.default.delete);
        this.router.get('/delete/:id', userController_1.default.delete);
        //Fin CRUD
        //CONTROL
        this.router.get('/users', /*TokenValidation,*/ userController_1.default.users);
        this.router.post('/procesar', /*TokenValidation,*/ userController_1.default.procesar);
        //CIERRE DE SESION
        this.router.get('/salir', userController_1.default.endSession);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
//# sourceMappingURL=userRoutes.js.map