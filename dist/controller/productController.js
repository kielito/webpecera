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
const productModel_1 = __importDefault(require("../models/productModel"));
// import csv from 'csv-parser'; Estaba este pero me tiraba error aun instalando el npm install csv-parser 
let variable = [];
var filename = "";
class ProductController {
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
                res.redirect("../user/signin");
                return;
            }
            else {
                const productos = yield productModel_1.default.listar();
                return res.json(productos);
            }
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const producto = yield productModel_1.default.buscarId(id);
            if (!producto)
                req.flash('error', 'El producto no existe!');
            return res.json(producto);
        });
    }
    // solo agrega en la tabla 
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const CodigoProducto = req.body;
            // los saco del form provisorio
            delete CodigoProducto.StockActual;
            delete CodigoProducto.PrecioVenta;
            delete CodigoProducto.IdProveedor;
            console.log(req.body);
            // VALIDAR CAMPOS CodigoProducto para alta desde control.hbs
            const busqueda = yield productModel_1.default.buscarCodigoProducto(CodigoProducto.CodigoProducto);
            if (!busqueda) {
                const result = yield productModel_1.default.crear(CodigoProducto);
                req.flash('confirmacion', 'Producto creado correctamente.');
                res.redirect('../product/control');
                return;
            }
            else {
                req.flash('error', 'El producto ya existe.');
                res.redirect("../product/control");
                return;
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const producto = yield productModel_1.default.buscarId(id);
            const result = yield productModel_1.default.actualizar(req.body, id);
            if (result) {
                req.flash('confirmacion', 'Producto Id:' + req.params.id + ', modificado.');
                res.redirect('../control');
                return;
            }
            else {
                req.flash('error', 'No se pudo modificar el Producto Id: ' + req.params.id + '.');
                res.redirect('../control');
                return;
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const result = yield productModel_1.default.eliminar(id);
            req.flash('confirmacion', 'Producto Id:' + req.params.id + ', elminado.');
            res.redirect('../control');
            return;
        });
    }
    //FIN CRUD
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error', 'Debes iniciar sesion para ver esta seccion');
                res.redirect("../user/signin");
                return;
            }
            const productos = yield productModel_1.default.listar();
            const proveedores = yield productModel_1.default.listarProveedor();
            res.render('partials/producto/productos', { products: productos, proveedor: proveedores, mi_session: true });
            return;
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const producto = yield productModel_1.default.buscarId(id);
            if (producto !== undefined) {
                res.render("partials/updateProducts", { producto });
            }
        });
    }
    //Carga CSV
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render("partials/producto/uploadfile");
            return;
        });
    }
    /*
        // linea 115 file.name
        public uploadfile(req:Request,res:Response,){
            let error;
            filename = "";

            if(req.files){
                console.log(req.files);
                var file = req.files.file;
                filename = file.name;
            }

            if(req.files !== null){
                req.flash('confirmacion','Archivo cargado correctamente!');
                res.redirect("./csv");
                return;
            } else
                req.flash('error', 'Debe seleccionar un archivo!');

            res.redirect("./upload");
            return;
        }
        // linea 133 separatot: ';'
        public leerCsv(req:Request,res:Response){
            variable = [];
            
            fs.createReadStream(filename)
            .pipe(csv({ separator: ';' }))
            .on('data', (row) => variable.push(row) )
            .on("end", () => {});
            
            res.render("partials/producto/uploadfile", { archivo: variable });
            return;
        }
    */
    updateCsv(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let codigo = "";
            let precio = "";
            let razonsocial = "";
            const cod_proveedor = [];
            for (let i = 0; i < variable.length; i++) {
                codigo = variable[i].CodigoProducto;
                precio = variable[i].Precio;
                razonsocial = variable[i].RazonSocial;
                delete variable[i].CodigoProducto;
                delete variable[i].Precio;
                delete variable[i].RazonSocial;
                const cod_proveedor = yield productModel_1.default.buscarProveedor(razonsocial);
                if (cod_proveedor !== undefined) {
                    yield productModel_1.default.actualizarProductos(variable[i], codigo);
                    yield productModel_1.default.actualizarPrecios(precio, codigo, cod_proveedor.Id);
                }
            }
            if (variable.length > 0)
                req.flash('confirmacion', 'Datos actualizados correctamente!');
            else
                req.flash('error', 'No se encontraron datos para actualizar!');
            res.redirect('./control');
            return;
        });
    }
    endSession(req, res) {
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
}
const productController = new ProductController();
exports.default = productController;
//# sourceMappingURL=productController.js.map