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
class SupplierModel {
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
                connectionLimit: 10
            });
        });
    }
    listar() {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const proveedores = yield this.db.query('SELECT proveedor.*, CONCAT(telefono_proveedor.Numero,"-",telefono_proveedor.Tipo) AS Telefono FROM proveedor LEFT JOIN telefono_proveedor ON proveedor.Id = telefono_proveedor.IdProveedor WHERE telefono_proveedor.Principal = "Si"');
            //console.log(proveedores[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return proveedores[0];
        });
    }
    listarTelefonos() {
        return __awaiter(this, void 0, void 0, function* () {
            //const db=this.connection;
            const clientes = yield this.db.query('SELECT * FROM telefono_proveedor');
            //console.log(clientes[0]);
            //devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
            return clientes[0];
        });
    }
    //Devuelve un objeto cuya fila en la tabla proveedores coincide con id.
    //Si no la encuentra devuelve null
    buscarId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM proveedor WHERE Id = ?', [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    buscarIdTelefono(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM telefono_proveedor WHERE IdProveedor = ?', [id]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0];
            return null;
        });
    }
    //Devuelve un objeto cuya fila en la tabla proveedores coincide con nombre.
    //Si no la encuentra devuelve null
    buscarProveedor(razonSocial) {
        return __awaiter(this, void 0, void 0, function* () {
            const encontrado = yield this.db.query('SELECT * FROM proveedor WHERE RazonSocial = ?', [razonSocial]);
            //Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
            if (encontrado.length > 1)
                return encontrado[0][0];
            return null;
        });
    }
    //Devuelve 1 si logro crear un nuevo proveedor de la tabla proveedores
    crear(proveedor) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('INSERT INTO proveedor SET ?', [proveedor]))[0].insertId;
            console.log(result);
            return result;
        });
    }
    crearTelefono(telefono) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('INSERT INTO telefono_proveedor SET ?', [telefono]))[0];
            return result;
        });
    }
    //Devuelve 1 si logro actualizar el proveedor indicado por id
    actualizar(proveedor, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE proveedor SET ? WHERE Id = ?', [proveedor, id]))[0].affectedRows;
            console.log(result);
            return result;
        });
    }
    actualizarTelefono(telefono, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (yield this.db.query('UPDATE telefono_proveedor SET ? WHERE Id = ?', [telefono, id]))[0].affectedRows;
            return result;
        });
    }
    //Devuelve 1 si logro eliminar el proveedor indicado por id
    eliminar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = (yield this.db.query('DELETE FROM proveedor WHERE Id = ?', [id]))[0].affectedRows;
            console.log(supplier);
            return supplier;
        });
    }
    eliminarTelefono(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield this.db.query('DELETE FROM telefono_proveedor WHERE IdProveedor = ?', [id]))[0].affectedRows;
            return user;
        });
    }
}
//Exportamos el enrutador con 
const supplierModel = new SupplierModel();
exports.default = supplierModel;
//# sourceMappingURL=supplierModel.js.map