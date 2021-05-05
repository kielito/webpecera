import {NextFunction, Request, response, Response} from 'express';
import { idText } from 'typescript';
import  userModel from '../models/userModel';
import jwt from 'jsonwebtoken';

class UserController{

	public signin(req:Request,res:Response){
        res.render("partials/signinForm");
	}

    public async login(req:Request,res:Response){
		const { usuario, password } = req.body;
        const result = await userModel.buscarNombre(usuario);
                           
        if (!result) 
            return res.status(400).json('User no exists!!');
        
        const correctPassword = await userModel.validarPassword(password, result.Password);         
        if (correctPassword) 
        {
            //JWT
            /*const token: string = jwt.sign({_id: result.Id}, process.env.TOKEN_SECRET || 'tokentest', {
                expiresIn: '1d' //vence en un dia
            }) 

            process.env.token_user = token;
            req.headers.authorization = process.env.token_user;           
            
            console.log(token);
            
            res.header('auth-token', process.env.token_user);
            res.redirect("./home");
            return;*/
            //JWT


            //CORRECTO!            
            res.redirect("./home");
            //res.render('partials/home');
            return;
        }
        return res.status(400).json('Clave Incorrecta!!');        
	}

    //REGISTRO
	public signup(req:Request,res:Response){		
		res.render("partials/signupForm");
	}

    public async home(req:Request,res:Response){        
        //JWT
        /*res.header('Authorization', process.env.token_user);        
        console.log(process.env.token_user)
        console.log(req.header('auth-token'))*/

		const usuarios = await userModel.listar();       
        res.render('partials/home', { users: usuarios });       
	}

	//CRUD
	public async list(req:Request,res:Response){		
        const usuarios = await userModel.listar();        
        return res.json(usuarios);
	}

	public async find(req:Request,res:Response){		
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);
        if (usuario)
            return res.json(usuario);
        res.status(404).json({ text: "User doesn't exists" });
	}

	public async addUser(req:Request,res:Response){
		const usuario = req.body;
        delete usuario.repassword;

        usuario.password = await userModel.encriptarPassword(usuario.password);
        const busqueda = await userModel.buscarNombre(usuario.usuario);
        
        if (!busqueda) {
            const result = await userModel.crear(usuario);            
            return res.json({ message: 'User saved!!' });
        }
        return res.json({ message: 'User existsss!!' });
	}

	public async update(req:Request,res:Response){		
        const { id } = req.params;
        const usuario = await userModel.buscarId(id);

        if(req.body.password === ""){
            return res.json({ message: 'La clave no puede estar vacía!' });						
		}
		if(req.body.rol === ""){
			return res.json({ message:'Debe seleccionar un Nuevo Rol!' });			
		}		
		else{

            req.body.password = await userModel.encriptarPassword(req.body.password);
            const result = await userModel.actualizar(req.body, id);
            
            if(result) {			
                return res.json({ message:'Usuario actualizado correctamente!'});			            
            }
            
            return res.json({ message:'El usuario y/o email ya se encuentra registrado!'});            
        }
    }

	public async delete(req:Request,res:Response){		
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await userModel.eliminar(id);        
        const usuarios = await userModel.listar();
        res.render('partials/controls', { users: usuarios });
	}
	//FIN CRUD


	public async control(req:Request,res:Response){		
        const usuarios = await userModel.listar();
        const users = usuarios;
        res.render('partials/controls', { users: usuarios });	
	}	

	public async procesar(req:Request,res:Response){
		const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const usuario = await userModel.buscarId(id);

        if(usuario !== undefined){            
			res.render("partials/update",{usuario});
        }
	}    
}

const userController = new UserController(); 
export default userController;