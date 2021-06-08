import { createPool } from 'mysql2/promise';
import bcryptjs from 'bcryptjs';


class UserModel {
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
			connectionLimit: 10 //es una idea de conexiones, el limete dependera de la carga que tenga el servidor
		});
	}

	async listar() {//Devuelve todas las filas de la tabla usuario		
		const usuarios = await this.db.query('SELECT * FROM usuario');		
		//devuelve tabla mas propiedades. Solo debemos devolver tabla. Posicion 0 del array devuelto.
		return usuarios[0];
	}

	//Devuelve un objeto cuya fila en la tabla usuarios coincide con id.
	//Si no la encuentra devuelve null
	async buscarId(id: string) {
		const encontrado: any = await this.db.query('SELECT * FROM usuario WHERE Id = ?', [id]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}
	//Devuelve un objeto cuya fila en la tabla usuarios coincide con nombre.
	//Si no la encuentra devuelve null
	async buscarNombre(nombre: string) {
		const encontrado: any = await this.db.query('SELECT * FROM usuario WHERE Usuario = ?', [nombre]);
		//Ojo la consulta devuelve una tabla de una fila. (Array de array) Hay que desempaquetar y obtener la unica fila al enviar
		if (encontrado.length > 1)
			return encontrado[0][0];
		return null;
	}

	//Devuelve 1 si logro crear un nuevo usuario de la tabla usuarios
	async crear(usuario: object) {
		//try{ AGREGAR!!
		const result = (await this.db.query('INSERT INTO usuario SET ?', [usuario]))[0].affectedRows;
		console.log(result);
		return result;
		//} catch{} AGREGAR!!
	}

	//Devuelve 1 si logro actualizar el usuario indicado por id
	async actualizar(usuario: object, id: string) {
		const result = (await this.db.query('UPDATE usuario SET ? WHERE Id = ?', [usuario, id]))[0].affectedRows;
		console.log(result);
		return result;
	}

	//Devuelve 1 si logro eliminar el usuario indicado por id
	async eliminar(id: string) {
		const user = (await this.db.query('DELETE FROM usuario WHERE Id = ?', [id]))[0].affectedRows;
		console.log(user);
		return user;
	}	

	
	//Encriptar Clave
	encriptarPassword = async(password: string): Promise<string> => {
        const salt = await bcryptjs.genSalt(10);
        return await bcryptjs.hash(password, salt);
    }

	//Compara la Clave ingresada vs la registrada
	validarPassword = async function (password: string, passwordhash: string): Promise<boolean> {		
        return await bcryptjs.compare(password, passwordhash);
    }
}

const userModel: UserModel = new UserModel();
export default userModel;
