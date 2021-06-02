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

    // agrega en la tabla  producto y producto_proveedor
    public async addProduct(req: Request, res: Response) {
        const CodigoProducto = req.body;
        // los saco del form provisorio
        console.log(req.body);       
        // VALIDAR CAMPOS CodigoProducto para alta desde control.hbs
        const busqueda = await productModel.buscarCodigoProducto(CodigoProducto.CodigoProducto);
        if (!busqueda) {            
            //const result = await productModel.crear(CodigoProducto);.
            const result = await productModel.crear(CodigoProducto.CodigoProducto, CodigoProducto.Descripcion);
            const result2 = await productModel.crearProductoProveedor(result, CodigoProducto.IdProveedor, CodigoProducto.StockMinimo, CodigoProducto.StockActual, CodigoProducto.PrecioVenta);
            req.flash('confirmacion', 'Producto creado correctamente.'); 
            res.redirect('../product/control');
            return;
        }
        else {
            // el producto existe verificar proveedor si no existe el proveedor cargo
            const resultBuscarProdProv = await productModel.buscarProductoProveedor(busqueda.Id, CodigoProducto.IdProveedor);
            if (!resultBuscarProdProv) { 
                const resultCrearProdProv = await productModel.crearProductoProveedor(busqueda.Id, CodigoProducto.IdProveedor, CodigoProducto.StockMinimo, CodigoProducto.StockActual, CodigoProducto.PrecioVenta);
                req.flash('confirmacion', 'Se a cargado el producto para un nuevo proveedor.'); 
                res.redirect("../product/control"); 
                return; 
            }
            else{               
                req.flash('error', 'Producto existente para el proveedor.'); 
                res.redirect("../product/control"); 
                return; 
            }                      
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

    public async updateProductoProveedor(req: Request, res: Response) {
        const { id } = req.params;       
        const productoProveedor = req.body;
        delete productoProveedor.CodigoProducto;
        delete productoProveedor.Descripcion;
        delete productoProveedor.RazonSocial;
        const result = await productModel.actualizarProductoProveedor(productoProveedor, id);            
        if(result) {
            req.flash('confirmacion','Producto modificado.');            
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
        const { CodigoProducto } = req.params;
        const { IdProveedor } = req.params;
        console.log(IdProveedor);
        const result = await productModel.eliminarProductoProveedor(id);
        req.flash('confirmacion','Se ha eliminado el producto para el proveedor.');        
        res.redirect('../control');
        return;       
    }    
    //FIN CRUD

    //MOSTRAR ABM
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

    public async mostrarUpdate(req:Request,res:Response){
        const { id } = req.params;
        const { codigoProducto } = req.params;
        const { razonSocial } = req.params;
        console.log(codigoProducto);
        const productoProveedor = await productModel.buscarIdProductoProveedor(id);
        const producto = await productModel.buscarCodigoProducto(codigoProducto);
        const proveedor = await productModel.listarProveedor();
        if(productoProveedor !== undefined){            
			res.render("partials/producto/update",{productoProveedor, producto, proveedor, razonSocial});
        }                	
	}
    //FIN MOSTRAR ABM

    //CARGA CSV
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
            filename = file.name; // falso error
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
    //FIN CARGA CSV

    public endSession(req: Request, res: Response) {
        req.session.user = {};
        req.session.auth = false;
        req.session.destroy(() => console.log("Session finalizada"));
        res.redirect("/");
    }
}

const productController = new ProductController();
export default productController;