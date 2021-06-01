import { Router, Request, Response } from 'express';
import supplierController from '../controller/supplierController'; //ruta relativa

class SupplierRoutes{
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
        this.router.get('/list',supplierController.list);
        this.router.get('/find/:id',supplierController.find);
        this.router.post('/add',supplierController.addSupplier);    
        this.router.get('/update/:id',supplierController.mostrarUpdate);
		this.router.post('/update/:id',supplierController.update);
        this.router.delete('/delete/:id',supplierController.delete);
        this.router.get('/delete/:id',supplierController.delete);
        // FIN CRUD
        this.router.get('/control',supplierController.control);        
	}
}

//Exportamos el enrutador con 
const supplierRoutes = new SupplierRoutes();
export default supplierRoutes.router;