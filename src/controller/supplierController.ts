import {Request, Response} from 'express';
import supplierModel from '../models/supplierModel'; 

class SupplierController{
    //CRUD
	public async list(req:Request,res:Response){
		console.log(req.body);
        const proveedores = await supplierModel.listar();
        console.log(proveedores);
        return res.json(proveedores);
        //res.send('Listado de clientes!!!');
	}

	public async find(req:Request,res:Response){
		console.log(req.params.id);
        const { id } = req.params;
        const proveedores = await supplierModel.buscarId(id);
        if (proveedores)
            return res.json(proveedores);
        res.status(404).json({ text: "Supplier doesn't exists" });
	}

	public async addSupplier(req:Request,res:Response){
		const proveedor = req.body;       
        console.log(req.body);
        //res.send('Proveedor agregado!!!');
        const busqueda = await supplierModel.buscarProveedor(proveedor.RazonSocial);// Hace referencia al campo Usuario de la tabla usuario.
        if (!busqueda) {
            const result = await supplierModel.crear(proveedor);
            req.flash('confirmacion','Proveedor registrado correctamente!');			
            return res.redirect("../supplier/control");
        }
        req.flash('error','El proveedor ya se encuentra registrado!');
		return res.redirect("../supplier/control");
	}

	public async update(req:Request,res:Response){
		console.log(req.body);
        const { id } = req.params;
        const result = await supplierModel.actualizar(req.body, id);
        //res.send('Proveedor '+ req.params.id +' actualizado!!!');
        req.flash('confirmacion','Proveedor actualizado correctamente!');			
        return res.redirect("../control");
	}

	public async delete(req:Request,res:Response){
		console.log(req.body);
        //res.send('Proveedor '+ req.params.id +' Eliminado!!!');
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await supplierModel.eliminar(id);
        req.flash('confirmacion','Proveedor eliminado correctamente!');			
        return res.redirect("../control");
	}
	//FIN CRUD

	public async control(req:Request,res:Response){
		//res.send('Controles');
        const proveedores = await supplierModel.listar();
        res.render('partials/proveedor/proveedores', { supplier: proveedores });		
	}

    public async mostrarUpdate(req:Request,res:Response){		
		const { id } = req.params;
        const proveedor = await supplierModel.buscarId(id);
        if(proveedor !== undefined){            
			res.render("partials/proveedor/update",{proveedor});
        }
	}	
}

const supplierController = new SupplierController(); 
export default supplierController;