import { Router, Request, Response } from 'express';
import productController from '../controller/productController'; //ruta relativa
// import { TokenValidation } from '../lib/verifyToken';

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
        
        this.router.get('/update/:id&:codigoProducto&:razonSocial',productController.mostrarUpdate); //dibujo la vista		
        this.router.post('/update/:id',productController.updateProductoProveedor);
        
        this.router.delete('/delete/:id',productController.delete);
        this.router.get('/delete/:id',productController.delete);
        this.router.get('/csv', productController.leerCsv);
       
        //Carga Archivo Excel
        this.router.get('/upload',productController.upload);
        this.router.post('/fileupload',productController.uploadfile);
        this.router.get('/updatecsv', productController.updateCsv);
        
        //Fin CRUD
        //CONTROL        
        this.router.get('/control',productController.control); // renderiza a partials/controls    
        //this.router.post('/procesar',/*TokenValidation,*/ userController.procesar);       
	}
}

const productRoutes = new ProductRoutes();
export default productRoutes.router;