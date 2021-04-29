import { Router, Request, Response } from 'express';
import userController from '../controller/userController'; //ruta relativa

class UserRoutes{
	public router: Router = Router();
	constructor(){
		this.config();
	}
	config():void{
        //se asocian rutas con el metodo de una clase existente:

		this.router.get('/',(req:Request,res:Response)=> {
            //res.send('Main!!!');
            res.render("partials/home"); /// cuando entre a /user renderiza a user/home                  
        });
        /*this.router.get('/signin',(req:Request,res:Response)=> {
            res.send('Sign In!!!');
            //res.render("partials/principal");
        }); //El msj ahora esta en userController*/ //Paso 9
        this.router.get('/signin',userController.signin); 
        this.router.post('/signin',userController.login); //Paso 15

        //registro
		this.router.get('/signup',userController.signup);
		this.router.post('/signup',userController.addUser);

        //Home del usuario
		/*this.router.get('/home',(req:Request,res:Response)=> {
            res.send('Bienvenido!!!')});*/        
        this.router.get('/home',userController.home);

        //CRUD
        this.router.get('/list',userController.list);
        this.router.get('/find/:id',userController.find);
        this.router.post('/add',userController.addUser);
        this.router.put('/update/:id',userController.update);
        this.router.delete('/delete/:id',userController.delete);
        // FIN CRUD

        this.router.get('/control',userController.control);
        this.router.post('/procesar',userController.procesar);

        
	}
}

//Exportamos el enrutador con 
const userRoutes = new UserRoutes();
export default userRoutes.router;