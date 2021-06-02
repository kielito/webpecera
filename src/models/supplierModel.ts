import { createPool } from 'mysql2/promise';

class SupplierModel {
	private db: any;
	constructor() {
		this.config(); //aplicamos la conexion con la BD.
	}

	async config() {//Parametro de conexion con la BD.
		this.db = await createPool({
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
	}

	async listar() {//Devuelve todas las filas de la tabla proveedores 
		//const db=this.connection;
		const proveedores = await this.db.query('SELECT proveedor.*, CONCAT(telefono_proveedor.Numero,"-",telefono_proveedor.Tipo) AS Telefono FROM proveedor LEFT JOIN telefono_proveedor ON proveedor.Id = telefono_proveedor.IdProveedor WHERE telefono_proveedor.Principal = "Si"');
		//console.log(proveedores[0]);
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return proveedores[0];
	}

	//Devuelve un objeto cuya fila en la tabla proveedores coincide con id.
	//Si no la encuentra devuelve null
	async buscarId(id: string) {
		const encontrado: any = await this.db.query('SELECT * FROM proveedor WHERE Id = ?', [id]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}
	
	//Devuelve un objeto cuya fila en la tabla proveedores coincide con nombre.
	//Si no la encuentra devuelve null
	async buscarProveedor(razonSocial: string) {
		const encontrado: any = await this.db.query('SELECT * FROM proveedor WHERE RazonSocial = ?', [razonSocial]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	//Devuelve 1 si logro crear un nuevo proveedor de la tabla proveedores
	async crear(proveedor: object) {
		const result = (await this.db.query('INSERT INTO proveedor SET ?', [proveedor]))[0].affectedRows;
		console.log(result);
		return result;
	}

	//Devuelve 1 si logro actualizar el proveedor indicado por id
	async actualizar(proveedor: object, id: string) {
		const result = (await this.db.query('UPDATE proveedor SET ? WHERE Id = ?', [proveedor, id]))[0].affectedRows;
		console.log(result);
		return result;
	}

	//Devuelve 1 si logro eliminar el proveedor indicado por id
	async eliminar(id: string) {
		const supplier = (await this.db.query('DELETE FROM proveedor WHERE Id = ?', [id]))[0].affectedRows;
		console.log(supplier);
		return supplier;
	}
}

//Exportamos el enrutador con 
const supplierModel: SupplierModel = new SupplierModel();
export default supplierModel;