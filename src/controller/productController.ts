import { Request, Response } from 'express';
import productModel from '../models/productModel';
import flash from "connect-flash";
import fs from 'fs';
import csv from 'csv-parser';
// import csv from 'csv-parser'; Estaba este pero me tiraba error aun instalando el npm install csv-parser 

let variable:any = [];
var filename = "";

class ProductController {
    
    //CRUD
    public async list(req: Request, res: Response) { //SIN USO POR EL MOMENTO
        if (!req.session.auth) {            
            req.flash('error_session', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("../user/signin");
            return;        
        }
        else
        {
            const productos = await productModel.listar();
            return res.json(productos);            
        }
    }

    public async find(req: Request, res: Response) { //SIN USO POR EL MOMENTO
        const { id } = req.params;
        const producto = await productModel.buscarId(id);
        if (!producto)
            req.flash('error', 'El producto no existe!');        
        return res.json(producto);
    }

    // solo agrega en la tabla 
    public async addProduct(req: Request, res: Response) {
        const CodigoProducto = req.body;
        // los saco del form provisorio
        console.log(req.body);       
        // VALIDAR CAMPOS CodigoProducto para alta desde control.hbs
        const busqueda = await productModel.buscarCodigoProducto(CodigoProducto.CodigoProducto);
        if (!busqueda) {
            //const result = await productModel.crear(CodigoProducto);.
            const result = await productModel.crear(CodigoProducto.CodigoProducto, CodigoProducto.Descripcion, CodigoProducto.StockMinimo);            
            const result2 = await productModel.crearProductoProveedor(result, CodigoProducto.IdProveedor, CodigoProducto.StockActual, CodigoProducto.PrecioVenta); 
            req.flash('confirmacion', 'Producto creado correctamente.'); 
            res.redirect('../product/control');
            return;
        }
        else {
            req.flash('error', 'El producto ya existe.'); 
            res.redirect("../product/control"); 
            return;           
        }
    }

    public async update(req: Request, res: Response) {
        const { id } = req.params;
        const producto = await productModel.buscarId(id);        
        const result = await productModel.actualizar(req.body, id);            
        if(result) {
            req.flash('confirmacion','Producto Id:'+req.params.id+', modificado.');            
            res.redirect('../control');    
            return;			            
        }
        else
        {
            req.flash('error', 'No se pudo modificar el Producto Id: '+req.params.id+'.'); 
            res.redirect('../control');    
            return;		
        }
    }

    public async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await productModel.eliminar(id);
        req.flash('confirmacion','Producto Id:'+req.params.id+', elminado.');        
        res.redirect('../control');
        return;       
    }
    //FIN CRUD

    public async control(req: Request, res: Response) {
        if (!req.session.auth) {            
            req.flash('error', 'Debes iniciar sesion para ver esta seccion');
            res.redirect("../user/signin");
            return;
        }
        const productos = await productModel.listar();        
        const proveedores = await productModel.listarProveedor();
        
        res.render('partials/producto/productos', { products: productos, proveedor: proveedores,  mi_session: true });
        return;
    }

    public async procesar(req:Request,res:Response){
		const { id } = req.params;
        const producto = await productModel.buscarId(id);

        if(producto !== undefined){            
			res.render("partials/updateProducts",{producto});
        }
	}   

    //Carga CSV
    public async upload(req:Request,res:Response){
        res.render("partials/producto/uploadfile");
        return;
	}    
        
    public uploadfile(req:Request,res:Response,){
        let error;
        filename = "";

        if(req.files){
            console.log(req.files);
            var file = req.files.file;
            filename = file.name;
        }

        if(req.files !== null){        
            req.flash('confirmacion','Archivo cargado correctamente!');
            res.redirect("./csv");
            return;
        } else
            req.flash('error', 'Debe seleccionar un archivo!');

        res.redirect("./upload");
        return;
    }
    
    public leerCsv(req:Request,res:Response){
        variable = [];
        
        fs.createReadStream(filename)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => variable.push(row) )
        .on("end", () => {});
        
        res.render("partials/producto/uploadfile", { archivo: variable });
        return;
    }
    

    public async updateCsv(req:Request,res:Response){
        let codigo = "";
        let precio = "";
        let razonsocial = ""; 
        const cod_proveedor:any = []; 

        for (let i=0;i<variable.length;i++) {  

            codigo = variable[i].CodigoProducto;
            precio = variable[i].Precio;
            razonsocial = variable[i].RazonSocial;

            delete variable[i].CodigoProducto;
            delete variable[i].Precio;
            delete variable[i].RazonSocial;

            const cod_proveedor = await productModel.buscarProveedor(razonsocial);
            
            if(cod_proveedor !== undefined){
                await productModel.actualizarProductos(variable[i], codigo);
                await productModel.actualizarPrecios(precio, codigo, cod_proveedor.Id);
            }
        }

        if(variable.length > 0)
                req.flash('confirmacion','Datos actualizados correctamente!');
        else
                req.flash('error', 'No se encontraron datos para actualizar!');

        res.redirect('./control');
        return;
	}    

    public endSession(req: Request, res: Response) {
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
}

const productController = new ProductController();
export default productController;