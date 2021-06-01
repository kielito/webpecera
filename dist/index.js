"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const indexRoutes_1 = __importDefault(require("./routes/indexRoutes"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/clientRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
dotenv_1.default.config(); //Para leer las varialbes de entorno (JWT)
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
    }
    config() {
        //Configuraciones
        this.app.set('port', process.env.PORT || 3000);
        this.app.set('views', path_1.default.join(__dirname, 'views')); //indicamos que views esta en dist y no en el modulo principal
        this.app.engine('.hbs', express_handlebars_1.default({
            defaultLayout: 'main',
            layoutsDir: path_1.default.join(this.app.get('views'), 'layouts'),
            partialsDir: path_1.default.join(this.app.get('views'), 'partials'),
            extname: 'hbs', //definimos la extension de los archivos
            //helpers: require('./lib/handlebars') //definimos donde estan los helpers
        }));
        this.app.set('view engine', '.hbs'); //ejecutamos el modulo definido
        //Middlewares
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default()); //iniciamos cors
        this.app.use(express_1.default.json()); //habilitamos el intercambio de objetos json entre aplicaciones
        this.app.use(express_1.default.urlencoded({ extended: true })); //Paso 21 - habilitamos para recibir datos a traves de formularios html.
        //this.app.use(express.static('public'));
        this.app.use(connect_flash_1.default());
        this.app.use(express_fileupload_1.default());
        //configuracion del middeware de sesion
        this.app.use(express_session_1.default({
            secret: 'secret_supersecret',
            resave: false,
            saveUninitialized: false //indica que no se guarde la sesion hasta que se inicialice
        }));
        // Archivos Publicos
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public'))); //metodo usado para indicar donde esta la carpeta public
        //Variables globales
        this.app.use((req, res, next) => {
            //this.app.locals.error_session=req.flash('error_session');
            this.app.locals.error = req.flash('error');
            this.app.locals.confirmacion = req.flash('confirmacion');
            this.app.locals.login = req.session.auth; //defino la veriable global para identificar cuando se loguea un usuario			
            //aca defino otra variable para otro mensaje flash
            //this.app.locals.producto_crud = req.flash('producto_crud');
            next();
        });
    }
    routes() {
        this.app.use(indexRoutes_1.default);
        this.app.use("/user", userRoutes_1.default); //user sera un objeto existene en la app.	
        this.app.use("/product", productRoutes_1.default); //user sera un objeto existene en la app.	
        this.app.use("/client", clientRoutes_1.default); //user sera un objeto existene en la app.
        this.app.use("/supplier", supplierRoutes_1.default); //user sera un objeto existene en la app.
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Server escuchando puerto " + this.app.get('port'));
        });
    }
}
const server = new Server();
server.start(); //Ejecutamos el metodo start en inica el server
//# sourceMappingURL=index.js.map