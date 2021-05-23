import { Router, Request, Response } from 'express';
import productController from '../controller/productController'; //ruta relativa
// import { TokenValidation } from '../lib/verifyToken';
import { leerCSVSchema }  from '../lib/readfile';

class ProductRoutes{
	public router: Router = Router();
	constructor(){
		this.config();
	}
	config():void{
        //se asocian rutas con el metodo de una clase existente:
		this.router.get('/',(req:Request,res:Response)=> {            
            res.render("partials/principal");               
        });        
        //CRUD
        this.router.get('/list',productController.list);
		this.router.get('/find/:id',productController.find);
		this.router.post('/add',productController.addProduct);        
        this.router.get('/update/:id',productController.procesar); //dibujo la vista		
        this.router.post('/update/:id',productController.update);
        this.router.delete('/delete/:id',productController.delete);
        this.router.get('/delete/:id',productController.delete);
        this.router.get('/csv', productController.leerCsv);
        this.router.get('/updatecsv', productController.updateCsv);
        
        //Fin CRUD
        //CONTROL        
        this.router.get('/control',productController.control); // renderiza a partials/controls    
        //this.router.post('/procesar',/*TokenValidation,*/ userController.procesar);
       
	}
}

const productRoutes = new ProductRoutes();
export default productRoutes.router;