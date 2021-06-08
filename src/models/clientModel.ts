import { createPool } from 'mysql2/promise';

class ClientModel {
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

	async listar() {//Devuelve todas las filas de la tabla cliente
		//const db=this.connection;
		const clientes = await this.db.query('SELECT cliente .*, CONCAT(telefono_cliente.Numero,"-",telefono_cliente.Tipo) AS Telefono FROM cliente LEFT JOIN telefono_cliente ON cliente.Id = telefono_cliente.IdCliente WHERE telefono_cliente.Principal = "Si"');
		//console.log(clientes[0]);
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return clientes[0];
	}

	async listarTelefonos() {//Devuelve todas las filas de la tabla cliente
		//const db=this.connection;
		const clientes = await this.db.query('SELECT * FROM telefono_cliente');
		//console.log(clientes[0]);
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return clientes[0];
	}

	//Devuelve un objeto cuya fila en la tabla cliente coincide con id.
	//Si no la encuentra devuelve null
	async buscarId(id: string) {
		const encontrado: any = await this.db.query('SELECT * FROM cliente WHERE Id = ?', [id]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	async buscarIdTelefono(id: string) {
		const encontrado: any = await this.db.query('SELECT * FROM telefono_cliente WHERE IdCliente = ?', [id]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0];
		return null;
	}
	
	//Devuelve un objeto cuya fila en la tabla cliente coincide con nombre.
	//Si no la encuentra devuelve null
	async buscarCliente(numeroDocumento: string) {
		const encontrado: any = await this.db.query('SELECT * FROM cliente WHERE NumeroDocumento = ?', [numeroDocumento]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	//Devuelve 1 si logro crear un nuevo cliente de la tabla cliente
	async crear(cliente: object) {
		const result = (await this.db.query('INSERT INTO cliente SET ?', [cliente]))[0].insertId;		
		return result;
	}

	async crearTelefono(telefono: object) {
		const result = (await this.db.query('INSERT INTO telefono_cliente SET ?', [telefono]))[0];		
		return result;
	}

	//Devuelve 1 si logro actualizar el cliente indicado por id
	async actualizar(cliente: object, id: string) {		
		const result = (await this.db.query('UPDATE cliente SET ? WHERE Id = ?', [cliente, id]))[0].affectedRows;		
		return result;
	}

	async actualizarTelefono(telefono: object, id: string) {
		const result = (await this.db.query('UPDATE telefono_cliente SET ? WHERE Id = ?', [telefono, id]))[0].affectedRows;		
		return result;
	}

	//Devuelve 1 si logro eliminar el cliente indicado por id
	async eliminar(id: string) {
		const user = (await this.db.query('DELETE FROM cliente WHERE Id = ?', [id]))[0].affectedRows;		
		return user;
	}

	async eliminarTelefono(id: string) {
		const user = (await this.db.query('DELETE FROM telefono_cliente WHERE IdCliente = ?', [id]))[0].affectedRows;		
		return user;
	}
}

//Exportamos el enrutador con 
const clientModel: ClientModel = new ClientModel();
export default clientModel;