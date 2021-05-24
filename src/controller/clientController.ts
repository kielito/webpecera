import {Request, Response} from 'express';
import clientModel from '../models/clientModel'; 

class ClientController{
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

    public async control(req:Request,res:Response){
        const clientes = await clientModel.listar();
        const clients = clientes;
        res.render('partials/cliente/clients', { clients: clientes });		
	}

    public async controlUpdate(req:Request,res:Response){
        res.render('partials/cliente/clients');		
	}

    //CRUD
	public async addClient(req:Request,res:Response){
		const cliente = req.body;
        delete cliente.repassword;

        const busqueda = await clientModel.buscarCliente(cliente.NumeroDocumento);
        if (!busqueda) {
            const result = await clientModel.crear(cliente);
            return res.json({ message: 'Client saved!!' });
        }
        return res.json({ message: 'Client exists!!' });
	}

	public async update(req:Request,res:Response){
        const { id } = req.params;
        const result = await clientModel.actualizar(req.body, id);
        return res.json({ text: 'updating a client ' + id });
	}

	public async delete(req:Request,res:Response){
        const { id } = req.params;
        const result = await clientModel.eliminar(id);
        return res.json({ text: 'deleting a client ' + id });
	}
	//FIN CRUD	
}

const clientController = new ClientController(); 
export default clientController;