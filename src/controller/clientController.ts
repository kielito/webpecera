import {Request, Response} from 'express';
import clientModel from '../models/clientModel'; 

class ClientController{
    //CRUD
	public async list(req:Request,res:Response){
		console.log(req.body);
        const clientes = await clientModel.listar();
        console.log(clientes);
        return res.json(clientes);
	}

	public async find(req:Request,res:Response){
		console.log(req.params.id);
        const { id } = req.params;
        const cliente = await clientModel.buscarId(id);
        if (cliente)
            return res.json(cliente);
        res.status(404).json({ text: "Client doesn't exists" });
	}
    
	public async addClient(req:Request,res:Response){
		const cliente = req.body;
        const busqueda = await clientModel.buscarCliente(cliente.NumeroDocumento);
        if (!busqueda) {
            const result = await clientModel.crear(cliente);
            req.flash('confirmacion','Cliente registrado correctamente!');			
            return res.redirect("../control");
        }
        req.flash('error','El cliente ya se encuentra registrado!');
		return res.redirect("../control");
	}

	public async update(req:Request,res:Response){
        const { id } = req.params;
        const result = await clientModel.actualizar(req.body, id);
        req.flash('confirmacion','Cliente actualizado correctamente!');			
        return res.redirect("../control");
	}

	public async delete(req:Request,res:Response){
        const { id } = req.params;
        const result = await clientModel.eliminar(id);
        req.flash('confirmacion','Cliente eliminado correctamente!');			
        return res.redirect("../control");
	}
	//FIN CRUD	

    public async control(req:Request,res:Response){
        const clientes = await clientModel.listar();
        res.render('partials/cliente/clients', { clients: clientes });		
	}

    public async mostrarUpdate(req:Request,res:Response){
        const { id } = req.params;
        const cliente = await clientModel.buscarId(id);
        if(cliente !== undefined){            
			res.render("partials/cliente/update",{cliente});
        }        	
	}
}

const clientController = new ClientController(); 
export default clientController;