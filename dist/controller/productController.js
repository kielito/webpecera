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
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
let variable = [];
class CarController {
    showError(req, res) {
        res.render("partials/error");
        return;
    }
    //CRUD
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.auth) {
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
                res.redirect("../user/signin");
                return;
            }
            else {
                console.log(req.body);
                const productos = yield productModel_1.default.listar();
                console.log(productos);
                return res.json(productos);
            }
        });
    }
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.id);
            const { id } = req.params;
            const producto = yield productModel_1.default.buscarId(id);
            if (producto)
                return res.json(producto);
            res.status(404).json({ text: "Product doesn't exists" });
        });
    }
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const codigoProducto = req.body;
            console.log(req.body);
            // VALIDAR CAMPOS CodigoProducto para alta desde control.hbs
            const busqueda = yield productModel_1.default.buscarCodigoProducto(codigoProducto.CodigoProducto);
            if (!busqueda) {
                const result = yield productModel_1.default.crear(codigoProducto);
                // alta de controls.hbs
                req.flash('producto_crud', 'Producto creado.');
                res.redirect('../control');
                return;
            }
            else {
                req.flash('producto_crud', 'El producto ya existe.');
                res.redirect("../control");
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
                req.flash('producto_crud', 'Producto Id:' + req.params.id + ', modificado.');
                res.redirect('../control');
                return;
            }
            else {
                req.flash('producto_crud', 'no se pudo modificar el Producto Id:' + req.params.id + '.');
                res.redirect('../control');
                return;
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const result = yield productModel_1.default.eliminar(id);
            req.flash('producto_crud', 'Producto Id:' + req.params.id + ', elminado.');
            res.redirect('../control');
            return;
        });
    }
    //FIN CRUD
    control(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // si no fue autenticado envialo a la ruta principal
            /*if (!req.session.auth) {
                req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
                res.redirect("../user/signin");
                return;
            }*/
            const productos = yield productModel_1.default.listar();
            const proveedores = yield productModel_1.default.listarProveedor();
            res.render('partials/producto/productos', { products: productos, proveedor: proveedores, mi_session: true });
            return;
        });
    }
    procesar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
            const auto = yield productModel_1.default.buscarId(id);
            if (auto !== undefined) {
                res.render("partials/updateProducts", { auto });
                console.log(auto);
            }
        });
    }
    //Carga CSV
    leerCsv(req, res) {
        fs_1.default.createReadStream("ejemplo.csv") // Abrir archivo
            .pipe(csv_parser_1.default({ separator: ';' })) // Pasarlo al parseador a través de una tubería
            .on('data', (row) => variable.push(row))
            .on("end", () => {
        });
        res.redirect('./updatecsv');
        return;
    }
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
                console.log(cod_proveedor);
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
    // Paso 8
    endSession(req, res) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
}
const carController = new CarController();
exports.default = carController;
//# sourceMappingURL=productController.js.map