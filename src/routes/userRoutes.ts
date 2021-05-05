import { Router, Request, Response } from 'express';
import userController from '../controller/userController'; //ruta relativa
import { TokenValidation } from '../lib/verifyToken';

class UserRoutes{
	public router: Router = Router();
	constructor(){
		this.config();
	}
	config():void{
        //se asocian rutas con el metodo de una clase existente:

		this.router.get('/',(req:Request,res:Response)=> {            
            res.render("partials/principal");               
        });
        
        //Login
        this.router.get('/signin', userController.signin);       
        this.router.post('/signin', userController.login);
        //this.router.use(auth);
       
		this.router.get('/signup',userController.signup);
		this.router.post('/signup',userController.addUser);

        //Home del usuario		        
        this.router.get('/home', /*TokenValidation,*/ userController.home);
        this.router.post('/home', /*TokenValidation,*/ userController.home);
        
        //CRUD
        this.router.get('/list',userController.list);
		this.router.get('/find/:id',userController.find);
		this.router.post('/add',userController.addUser);
        
        this.router.get('/update/:id',userController.procesar); //dibujo la vista		
        this.router.post('/update/:id',userController.update);

        this.router.delete('/delete/:id',userController.delete);
        this.router.get('/delete/:id',userController.delete);
		
        //Fin CRUD

        //CONTROL
        this.router.get('/control',/*TokenValidation,*/ userController.control);
        this.router.post('/procesar',/*TokenValidation,*/ userController.procesar);
	}
}

const userRoutes = new UserRoutes();
export default userRoutes.router;