const { response } = require('express');
const bcrypt = require('bcryptjs');

const req = require('express/lib/request');
const Medico = require('../models/Medico');
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async(req, res) => {

    const medicos = await Medico.find({},'nombre img')
                            .populate('hospital','nombre')
                            .populate('usuario','nombre');

    res.json({
        ok: true,
        medico: medicos
    });

}

const crearMedico = async(req, res) => {

    
    const { uid } = req.uid;
    //const { nombre, img, usuario, hospital } = req.body;
    const { nombre } = req.body;
    const medico = new Medico( { usuario: uid, ...req.body } );
        

    try{

        const existeNombre = await Medico.findOne( { nombre } );

        if(existeNombre){
            return res.status(400).json({
                ok: false,
                msg: 'El Nombre ya está registrado'
    
            });
        }

        
        //guardar usuario
        const medicoBD = await medico.save();
        

        res.json({
            ok: true,
            medico: medicoBD
        });


    }catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado .... revisar lógica'

        })
    }

    
}

const actualizarMedico = async(req, res = response) =>{

    //ToDo: Validar token y comprobar si es el usuario correcto

    const id = req.params.id;    
    const uid = req.uid;
    const nombre = req.nombre;
    
    try{

        const medicoBD = await Medico.findById(id);

        if( !medicoBD ){
            res.status(404).json({
                ok: false,
                msg: 'No existe medico por ese ID'    
            });
        }
        

        //Actualizaciones        
        const { nombre, hospital, uid, ...campos}  = req.body;
        

       /* if( medicoBD.nombre !== nombre ){            
            const existeNombre = await Medico.findOne({ nombre });
            if( existeNombre ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe medico con ese nombre'    
                });
            }
        }       */

        const medicoActualizado = await Medico.findByIdAndUpdate(id, campos, {new: true});


        res.json({
            ok: true,
            msg: 'medico actualizado',
            medico: medicoActualizado
        });


    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado .... revisar lógica'

        });


    }

}

const borrarMedico = async(req, res = response) =>{

    const id = req.params.id;
    try{

        const medicoBD = await Medico.findById(id);

        if( !medicoBD ){
            res.status(404).json({
                ok: false,
                msg: 'No existe usuario por ese ID'    
            });
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error no se puede eliminar Medico .... revisar lógica'

        });

    }


}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico

}