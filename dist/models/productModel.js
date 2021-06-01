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
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = require("mysql2/promise");
class ProductModel {
    constructor() {
        this.config(); //aplicamos la conexion con la BD.
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            this.db = yield promise_1.createPool({
                /*
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'heroku_4505cc56058eb11',
                */
                host: 'us-cdbr-east-03.cleardb.com',
                user: 'b0e0fd43ed8818',
                password: '2b1f9d39',
                database: 'heroku_4505cc56058eb11',
                connectionLimit: 10 //es una idea de conexiones, el limete dependera de la carga que tenga el servidor
            });
        });
    }
    listar() {
        return __awaiter(this, void 0, void 0, function* () {
            const productos = yield this.db.query('SELECT p.CodigoProducto, p.Descripcion, p.StockMinimo, pp.StockActual, pp.PrecioVenta, pv.RazonSocial FROM producto p INNER JOIN producto_proveedor pp ON p.Id = pp.IdProducto INNER JOIN proveedor pv ON pp.IdProveedor = pv.Id');
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return productos[0];
        });
    }
    listarProveedor() {
        return __awaiter(this, void 0, void 0, function* () {
            const productos = yield this.db.query('SELECT Id As IdProveedor, RazonSocial AS Proveedor FROM proveedor');
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return productos[0];
        });
    }
    //Devuelve un objeto cuya fila en la tabla productos coincide con id.
    //Si no la encuentra devuelve null
    buscarId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM producto WHERE Id = ?', [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    buscarProveedor(razonSocial) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT Id FROM proveedor WHERE RazonSocial = ?', [razonSocial]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla producto coincide con CodigoProducto.
    //Si no la encuentra devuelve null
    buscarCodigoProducto(codigoProducto) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM producto WHERE CodigoProducto = ?', [codigoProducto]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla producto coincide con Descripcion.
    //Si no la encuentra devuelve null
    buscarDescripcion(descripcion) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM producto WHERE Descripcion = ?', [descripcion]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve 1 si logro crear un nuevo producto de la tabla producto
    crear(producto) {
        return __awaiter(this, void 0, void 0, function* () {
            //try{ AGREGAR!!
            const result = (yield this.db.query('INSERT INTO producto SET ?', [producto]))[0].insertId;
            console.log(result);
            return;
            //} catch{} AGREGAR!!
        });
    }
    crearProductoProveedor(producto) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('INSERT INTO producto_proveedor SET ?', [producto]))[0].affectArrow;
            return result;
        });
    }
    //Devuelve 1 si logro actualizar el producto indicado por id
    actualizar(producto, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE producto SET ? WHERE Id = ?', [producto, id]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    actualizarProductos(producto, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE producto SET ? WHERE CodigoProducto = ?', [producto, id]))[0].affectedRows;
            return result;
        });
    }
    actualizarPrecios(producto, id, id_proveedor) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE producto_proveedor INNER JOIN producto ON producto_proveedor.IdProducto = producto.Id SET PrecioVenta = ? WHERE producto.CodigoProducto = ? AND producto_proveedor.IdProveedor = ?', [producto, id, id_proveedor]))[0];
            console.log(result);
            return result;
        });
    }
    //Devuelve 1 si logro eliminar el producto indicado por id
    eliminar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = (yield this.db.query('DELETE FROM producto WHERE Id = ?', [id]))[0].affectedRows;
            return product;
        });
    }
}
const productModel = new ProductModel();
exports.default = productModel;
//# sourceMappingURL=productModel.js.map