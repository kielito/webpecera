import {Request, Response} from 'express';
import clientModel from '../models/clientModel'; 

class ClientController{
    //CRUD   
    public add(req:Request,res:Response){		
		res.render("partials/cliente/alta");
	}
    
	public async addClient(req:Request,res:Response){
		const cliente = req.body;
        const telefono = {
            Numero: cliente.Numero, 
            Tipo: cliente.Tipo,
            Principal: "Si",
            IdCliente : ""
        };

        delete cliente.Numero;
        delete cliente.Tipo;

        const busqueda = await clientModel.buscarCliente(cliente.NumeroDocumento);

        if (!busqueda) {
            telefono.IdCliente = await clientModel.crear(cliente);       
            await clientModel.crearTelefono(telefono);

            req.flash('confirmacion','Cliente registrado correctamente!');			
            return res.redirect("../control");
        }
        req.flash('error','El cliente ya se encuentra registrado!');
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
                await clientModel.actualizarTelefono(telefono, cliente.Id[i]);
            }
        } else {
            let telefono = {
                Numero: cliente.Numero, 
                Tipo: cliente.Tipo
            };
            await clientModel.actualizarTelefono(telefono, cliente.Id);
        }

        delete cliente.Numero;
        delete cliente.Tipo;
        delete cliente.Id;

        await clientModel.actualizar(cliente, id);        
        req.flash('confirmacion','Cliente actualizado correctamente!');			
        return res.redirect("../control");
	}

	public async delete(req:Request,res:Response){
        const { id } = req.params;
        await clientModel.eliminarTelefono(id);
        await clientModel.eliminar(id);
        req.flash('confirmacion','Cliente eliminado correctamente!');			
        return res.redirect("../control");
	}
	//FIN CRUD	

    public async control(req:Request,res:Response){
        const clientes = await clientModel.listar();
        const telefonos = await clientModel.listarTelefonos();
        res.render('partials/cliente/clientes', { clients: clientes, telefono: telefonos });		
	}

    public async mostrarUpdate(req:Request,res:Response){
        const { id } = req.params;
        const clientes = await clientModel.buscarId(id);
        const telefonos = await clientModel.buscarIdTelefono(id);
        if(clientes !== undefined){            
			res.render("partials/cliente/edicion",{cliente: clientes, telefono: telefonos});
        }        	
	}
}

const clientController = new ClientController(); 
export default clientController;