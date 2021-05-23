import { createPool } from 'mysql2/promise';
import { response } from 'express';

class ProductModel {
	private db: any;
	constructor() {
		this.config(); //aplicamos la conexion con la BD.
	}

	async config() {//Parametro de conexion con la BD.
		this.db = await createPool({
			host: 'us-cdbr-east-03.cleardb.com',
			user: 'b0e0fd43ed8818',
			password:'2b1f9d39',
			database: 'heroku_4505cc56058eb11',	
			connectionLimit: 10 //es una idea de conexiones, el limete dependera de la carga que tenga el servidor
		});
	}

	async listar() {//Devuelve todas las filas de la tabla producto		
		const productos = await this.db.query('SELECT p.CodigoProducto, p.Descripcion, p.StockMinimo, pp.StockActual, pp.PrecioVenta, pv.RazonSocial FROM producto p INNER JOIN producto_proveedor pp ON p.Id = pp.IdProducto INNER JOIN proveedor pv ON pp.IdProveedor = pv.Id');
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return productos[0];
	}

	async listarProveedor() {//Devuelve todas las filas de la tabla producto		
		const productos = await this.db.query('SELECT RazonSocial AS Proveedor FROM proveedor');
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return productos[0];
	}

	//Devuelve un objeto cuya fila en la tabla productos coincide con id.
	//Si no la encuentra devuelve null
	async buscarId(id: string) {
		const encontrado: any = await this.db.query('SELECT * FROM producto WHERE Id = ?', [id]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	async buscarProveedor(razonSocial: string) {		
		const encontrado: any = await this.db.query('SELECT Id FROM proveedor WHERE RazonSocial = ?', [razonSocial]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
				
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	//Devuelve un objeto cuya fila en la tabla producto coincide con CodigoProducto.
	//Si no la encuentra devuelve null
	async buscarCodigoProducto(codigoProducto: string) {
		const encontrado: any = await this.db.query('SELECT * FROM producto WHERE CodigoProducto = ?', [codigoProducto]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

    //Devuelve un objeto cuya fila en la tabla producto coincide con Descripcion.
	//Si no la encuentra devuelve null
	async buscarDescripcion(descripcion: string) {
		const encontrado: any = await this.db.query('SELECT * FROM producto WHERE Descripcion = ?', [descripcion]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	//Devuelve 1 si logro crear un nuevo producto de la tabla producto
	async crear(producto: object) {
		//try{ AGREGAR!!
		const result = (await this.db.query('INSERT INTO producto SET ?', [producto]))[0].affectedRows;
		console.log(result);
		return result;
		//} catch{} AGREGAR!!
	}

	//Devuelve 1 si logro actualizar el producto indicado por id
	async actualizar(producto: object, id: string) {
		const result = (await this.db.query('UPDATE producto SET ? WHERE Id = ?', [producto, id]))[0].affectedRows;
		console.log(result);
		return result;
	}
	
	async actualizarProductos(producto: object, id: string) {
		const result = (await this.db.query('UPDATE producto SET ? WHERE CodigoProducto = ?', [producto, id]))[0].affectedRows;		
		return result;
	}

	async actualizarPrecios(producto: string, id: string, id_proveedor: string) {
		const result = (await this.db.query('UPDATE producto_proveedor INNER JOIN producto ON producto_proveedor.IdProducto = producto.Id SET PrecioVenta = ? WHERE producto.CodigoProducto = ? AND producto_proveedor.IdProveedor = ?', [producto, id, id_proveedor]))[0];		
		console.log(result);
		return result;
	}

	//Devuelve 1 si logro eliminar el producto indicado por id
	async eliminar(id: string) {
		const product = (await this.db.query('DELETE FROM producto WHERE Id = ?', [id]))[0].affectedRows;		
		return product;
	}
}

const productModel: ProductModel = new ProductModel();
export default productModel;
