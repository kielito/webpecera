import { Request, Response } from 'express';
import productModel from '../models/productModel';
import flash from "connect-flash";

class CarController {    
    public showError(req: Request, res: Response) {
        res.render("partials/error");
        return;
    }   

    //CRUD
    public async list(req: Request, res: Response) { 
        if (!req.session.auth) {            
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
            return;        
        }
        else
        {        
            console.log(req.body);
            const productos = await productModel.listar();
            console.log(productos);
            return res.json(productos);            
        }
    }

    public async find(req: Request, res: Response) {
        console.log(req.params.id);
        const { id } = req.params;
        const producto = await productModel.buscarId(id);
        if (producto)
            return res.json(producto);
            res.status(404).json({ text: "Product doesn't exists" });
    }

    public async addProduct(req: Request, res: Response) {
        const codigoProducto = req.body;
        console.log(req.body);       
        // VALIDAR CAMPOS CodigoProducto para alta desde control.hbs
        const busqueda = await productModel.buscarCodigoProducto(codigoProducto.CodigoProducto);
        if (!busqueda) {
            const result = await productModel.crear(codigoProducto);
            // alta de controls.hbs
            req.flash('producto_crud', 'Producto creado.'); 
            res.redirect('../control');
            return;                       
        }
        else {
            req.flash('producto_crud', 'El producto ya existe.'); 
            res.redirect("../control"); 
            return;           
        }
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const producto = await productModel.buscarId(id);        
        const result = await productModel.actualizar(req.body, id);            
        if(result) {			
            req.flash('producto_crud', 'Producto Id:'+req.params.id+', modificado.'); 
            res.redirect('../control');    
            return;			            
        }
        else
        {
            req.flash('producto_crud', 'no se pudo modificar el Producto Id:'+req.params.id+'.'); 
            res.redirect('../control');    
            return;		
        }
    }

    public async delete(req: Request, res: Response) {
        console.log(req.body);       
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await productModel.eliminar(id);
        req.flash('producto_crud', 'Producto Id:'+req.params.id+', elminado.'); 
        res.redirect('../control');
        return;       
    }
    //FIN CRUD

    public async control(req: Request, res: Response) {
        // si no fue autenticado envialo a la ruta principal
        if (!req.session.auth) {            
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("./error");
            return;
        }
        const productos = await productModel.listar();
        const products = productos;
        res.render('partials/producto/productos', { products: productos, mi_session: true });
        return;
    }

    public async procesar(req:Request,res:Response){
		const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const auto = await productModel.buscarId(id);
        if(auto !== undefined){            
			res.render("partials/updateProducts",{auto});
            console.log(auto);
        }
	}   

    // Paso 8
    public endSession(req: Request, res: Response) {
        console.log(req.body);
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
}

const carController = new CarController();
export default carController;