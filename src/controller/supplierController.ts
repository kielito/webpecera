import {Request, Response} from 'express';
import supplierModel from '../models/supplierModel'; 

class SupplierController{
    //CRUD
	public add(req:Request,res:Response){		
		res.render("partials/proveedor/alta");
	}

	public async addSupplier(req:Request,res:Response){
		const proveedor = req.body;
        const telefono = {
            Numero: proveedor.Numero, 
            Tipo: proveedor.Tipo,
            Principal: "Si",
            IdProveedor : ""
        };

        delete proveedor.Numero;
        delete proveedor.Tipo;

        const busqueda = await supplierModel.buscarProveedor(proveedor.RazonSocial);// Hace referencia al campo Usuario de la tabla usuario.
        
        if (!busqueda) {
            telefono.IdProveedor = await supplierModel.crear(proveedor);
            await supplierModel.crearTelefono(telefono);

            req.flash('confirmacion','Proveedor registrado correctamente!');			
            return res.redirect("../control");
        }
        req.flash('error','El proveedor ya se encuentra registrado!');
		return res.redirect("../control");
	}

	public async update(req:Request,res:Response){
        const { id } = req.params;
        const cliente = req.body;
        
        if(cliente.Numero instanceof Array)
        {
            for (let i=0;i<cliente.Numero.length;i++) {
                const telefono = {
                    Numero: cliente.Numero[i], 
                    Tipo: cliente.Tipo[i]
                };
                await supplierModel.actualizarTelefono(telefono, cliente.Id[i]);
            }
        } else {
            let telefono = {
                Numero: cliente.Numero, 
                Tipo: cliente.Tipo
            };
            await supplierModel.actualizarTelefono(telefono, cliente.Id);
        }

        delete cliente.Numero;
        delete cliente.Tipo;
        delete cliente.Id;

        await supplierModel.actualizar(cliente, id);
        req.flash('confirmacion','Proveedor actualizado correctamente!');			
        return res.redirect("../control");
	}

	public async delete(req:Request,res:Response){
        const { id } = req.params; // hacemos detrucsturing y obtenemos el ID. Es decir, obtenemos una parte de un objeto JS.
        const result = await supplierModel.eliminar(id);
        req.flash('confirmacion','Proveedor eliminado correctamente!');			
        return res.redirect("../control");
	}
	//FIN CRUD

	public async control(req:Request,res:Response){
        const proveedores = await supplierModel.listar();
        res.render('partials/proveedor/proveedores', { supplier: proveedores });		
	}

    public async mostrarUpdate(req:Request,res:Response){		
		const { id } = req.params;
        const proveedor = await supplierModel.buscarId(id);
        const telefonos = await supplierModel.buscarIdTelefono(id);

        if(proveedor !== undefined){            
			res.render("partials/proveedor/edicion",{proveedor, telefono: telefonos});
        }
	}	
}

const supplierController = new SupplierController(); 
export default supplierController;