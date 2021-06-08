import {NextFunction, Request, response, Response} from 'express';
import { idText } from 'typescript';
import  userModel from '../models/userModel';
import jwt from 'jsonwebtoken';
import flash from "connect-flash";

class UserController{

	public signin(req:Request,res:Response){
        res.render("partials/user/signinForm");
	}

    public async login(req:Request,res:Response){
		const { usuario, password } = req.body;
        const result = await userModel.buscarNombre(usuario);
                           
        if (!result) {
            req.flash('error','El Usuario no se encuentra registrado');
            return res.redirect("./signin");	
        } else {
            const correctPassword = await userModel.validarPassword(password, result.Password);         
            
            if (correctPassword) 
            {
                //JWT
                /*const token: string = jwt.sign({_id: result.Id}, process.env.TOKEN_SECRET || 'tokentest', {
                    expiresIn: '1d' //vence en un dia
                }) 

                //process.env.token_user = token;
                //req.headers.authorization = process.env.token_user;           
                
                //console.log(token);
                
                res.header('auth-token', token);
                //res.render('partials/home');
                res.redirect("./home");
                return;*/
                //JWT


                //CORRECTO!
                req.session.user=result;
                req.session.auth=true;

                req.flash('confirmacion','Bienvenido ' + result.Nombre + '!!');
                res.redirect("./home");
                //res.render('partials/home');
                return;
            } else {
                req.flash('error','Password Incorrecto');
                res.redirect("./signin");
            }
        }     
	}

    //REGISTRO
	public signup(req:Request,res:Response){		
		res.render("partials/user/signupForm");
	}

    public async home(req:Request,res:Response){        
        //JWT en Authotization
        /*res.header('Authorization', process.env.token_user);        
        console.log(process.env.token_user)        
        
        console.log(req.header('auth-token'))*/
        //JWT en auth-token
        
        
        if(!req.session.auth){
            req.flash('error','Debes iniciar sesion para ver esta seccion!');
            res.redirect("./signin");
        }		
		res.render("partials/user/home");
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
        
        if(usuario.Password.length === 0){
			req.flash('error','Debe ingresar una clave!');
			return res.redirect("./signup");
		}

		if(usuario.Password !== usuario.repassword){
			req.flash('error','Verifique la clave ingresada!');
			return res.redirect("./signup");
		}
		delete usuario.repassword;

        usuario.Password = await userModel.encriptarPassword(usuario.Password);
        const busqueda = await userModel.buscarNombre(usuario.Usuario);
        
        if (!busqueda) {
            const result = await userModel.crear(usuario);
            
            if (!result) 
				res.status(404).json({ text: "No se pudo crear el usuario" });
			req.flash('confirmacion','Usuario Registrado correctamente!');			
            return res.redirect("./users");
        }
		req.flash('error','El usuario y/o email ya se encuentra registrado!');
		return res.redirect("./signup");
	}

	public async update(req:Request,res:Response){		
        if(!req.session.auth){
            req.flash('error','Debe iniciar sesion para ver esta seccion');
			res.redirect("../signin");
        }
		
        const { id } = req.params;		
		const usuario = await userModel.buscarId(id);

        console.log(req.body);

        if(req.body.Password !== req.body.repassword){
			req.flash('error','Verifique la clave ingresada!');			
            return res.render("partials/user/update",{usuario: req.body, home:req.session.user, mi_session:true});
		}
		delete req.body.repassword;

		req.body.Password = await userModel.encriptarPassword(req.body.Password);
        const result = await userModel.actualizar(req.body, id);
        
		if(result) {			
		req.flash('confirmacion','Usuario "' + req.body.Usuario + '" actualizado correctamente!');			
        return res.redirect("../users");
		}
		
		req.flash('error','El usuario y/o email ya se encuentra registrado!');
		return res.render("partials/user/update",{usuario, home:req.session.user, mi_session:true});
		
    }

	public async delete(req:Request,res:Response){		
        if(!req.session.auth){
            req.flash('error','Debe iniciar sesion para ver esta seccion');
			res.redirect("../signin");
        }        
        const { id } = req.params;
        const result = await userModel.eliminar(id);        
		req.flash('confirmacion','Se eliminó el Usuario correctamente!');			
		res.redirect('../users');
	}
	//FIN CRUD

	public async users(req:Request,res:Response){		
        if(!req.session.auth){
            req.flash('error','Debe iniciar sesion para ver esta seccion');
			res.redirect("./signin");
        }
        const usuarios = await userModel.listar();       
        res.render('partials/user/users', { users: usuarios, mi_session:true });
	}	

	public async procesar(req:Request,res:Response){
		if(!req.session.auth){            
			req.flash('error','Debes iniciar sesion para ver esta seccion');
			return res.redirect("../signin");
        }

		const { id } = req.params;
        const usuario = await userModel.buscarId(id);

        console.log(usuario);

        if(usuario !== undefined){            
			res.render("partials/user/update",{usuario, home:req.session.user, mi_session:true});
        }
	}   
    
    
    //METODO PARA CERRAR LA SESION
	public endSession(req: Request, res: Response){        
        req.session.user={}; //Se borran los datos del usuarios guardados en la variable user
        req.session.auth=false; //Se pone autenticado en false
        req.session.destroy(()=>console.log("Sesion finalizada")); //Metodo para destruir datos asociados a la sesion
        res.redirect("/");
    }
}

const userController = new UserController(); 
export default userController;