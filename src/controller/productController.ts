import { Request, Response } from 'express';
import productModel from '../models/productModel';
import flash from "connect-flash";
import fs from 'fs';
import csv from 'csv-parser';

let variable = [];

class CarController {    

    public showError(req: Request, res: Response) {
        res.render("partials/error");
        return;
    }   

    //CRUD
    public async list(req: Request, res: Response) { 
        if (!req.session.auth) {            
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("../user/signin");
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
        /*if (!req.session.auth) {            
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("../user/signin");
            return;
        }*/
        const productos = await productModel.listar();        
        const proveedores = await productModel.listarProveedor();
        
        res.render('partials/producto/productos', { products: productos, proveedor: proveedores,  mi_session: true });
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

    //Carga CSV
    public async leerCsv(req:Request,res:Response){  
        fs.createReadStream("ejemplo.csv") // Abrir archivo
        .pipe(csv({ separator: ';' })) // Pasarlo al parseador a través de una tubería
        .on('data', (row) => variable.push(row) )
        .on("end", () => {// Y al finalizar, terminar lo necesario
        });      
        res.redirect('./updatecsv');
        return;
	} 

    public async updateCsv(req:Request,res:Response){        
        console.log("Paso por Controller");
        console.log(variable);

        for (let i=0;i<variable.length;i++) {            
            const id = variable[i].Id;
            delete variable[i].Id;
            await productModel.actualizarProductos(variable[i], id);
        }
        req.flash('confirmacion','Datos actualizados correctamente!');
        res.redirect('./control');
        return;
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