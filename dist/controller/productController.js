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
    // agrega en la tabla  producto y producto_proveedor
    addProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const CodigoProducto = req.body;
            // los saco del form provisorio
            console.log(req.body);
            // VALIDAR CAMPOS CodigoProducto para alta desde control.hbs
            const busqueda = yield productModel_1.default.buscarCodigoProducto(CodigoProducto.CodigoProducto);
            if (!busqueda) {
                //const result = await productModel.crear(CodigoProducto);.
                const result = yield productModel_1.default.crear(CodigoProducto.CodigoProducto, CodigoProducto.Descripcion);
                const result2 = yield productModel_1.default.crearProductoProveedor(result, CodigoProducto.IdProveedor, CodigoProducto.StockMinimo, CodigoProducto.StockActual, CodigoProducto.PrecioVenta);
                req.flash('confirmacion', 'Producto creado correctamente.');
                res.redirect('../product/control');
                return;
            }
            else {
                // el producto existe verificar proveedor si no existe el proveedor cargo
                const resultBuscarProdProv = yield productModel_1.default.buscarProductoProveedor(busqueda.Id, CodigoProducto.IdProveedor);
                if (!resultBuscarProdProv) {
                    const resultCrearProdProv = yield productModel_1.default.crearProductoProveedor(busqueda.Id, CodigoProducto.IdProveedor, CodigoProducto.StockMinimo, CodigoProducto.StockActual, CodigoProducto.PrecioVenta);
                    req.flash('confirmacion', 'Se a cargado el producto para un nuevo proveedor.');
                    res.redirect("../product/control");
                    return;
                }
                else {
                    req.flash('error', 'Producto existente para el proveedor.');
                    res.redirect("../product/control");
                    return;
                }
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
    updateProductoProveedor(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const productoProveedor = req.body;
            delete productoProveedor.CodigoProducto;
            delete productoProveedor.Descripcion;
            delete productoProveedor.RazonSocial;
            const result = yield productModel_1.default.actualizarProductoProveedor(productoProveedor, id);
            if (result) {
                req.flash('confirmacion', 'Producto modificado.');
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
            const { CodigoProducto } = req.params;
            const { IdProveedor } = req.params;
            console.log(IdProveedor);
            const result = yield productModel_1.default.eliminarProductoProveedor(id);
            req.flash('confirmacion', 'Se ha eliminado el producto para el proveedor.');
            res.redirect('../control');
            return;
        });
    }
    //FIN CRUD
    //MOSTRAR ABM
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
    mostrarUpdate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { codigoProducto } = req.params;
            const { razonSocial } = req.params;
            console.log(codigoProducto);
            const productoProveedor = yield productModel_1.default.buscarIdProductoProveedor(id);
            const producto = yield productModel_1.default.buscarCodigoProducto(codigoProducto);
            const proveedor = yield productModel_1.default.listarProveedor();
            if (productoProveedor !== undefined) {
                res.render("partials/producto/update", { productoProveedor, producto, proveedor, razonSocial });
            }
        });
    }
    //FIN MOSTRAR ABM
    //CARGA CSV
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.render("partials/producto/uploadfile");
            return;
        });
    }
    uploadfile(req, res) {
        let error;
        filename = "";
        if (req.files) {
            console.log(req.files);
            var file = req.files.file;
            filename = file.name; // falso error
        }
        if (req.files !== null) {
            req.flash('confirmacion', 'Archivo cargado correctamente!');
            res.redirect("./csv");
            return;
        }
        else
            req.flash('error', 'Debe seleccionar un archivo!');
        res.redirect("./upload");
        return;
    }
    leerCsv(req, res) {
        variable = [];
        fs_1.default.createReadStream(filename)
            .pipe(csv_parser_1.default({ separator: ';' }))
            .on('data', (row) => variable.push(row))
            .on("end", () => { });
        res.render("partials/producto/uploadfile", { archivo: variable });
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
    //FIN CARGA CSV
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