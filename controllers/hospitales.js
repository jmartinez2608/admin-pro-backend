const { response } = require('express');
//const bcrypt = require('bcryptjs');

const req = require('express/lib/request');
const Hospital = require('../models/hospital');
//const { generarJWT } = require('../helpers/jwt');

const getHospitales = async(req, res) => {

    const hospitales = await Hospital.find({},'nombre img')
                                        .populate('usuario','nombre email img');
    //const hospitales = await Hospital.find();

    res.json({
        ok: true,
        hospital: hospitales        
    });

}

const crearHospital = async( req, res = response ) => {

    const { uid } = req.uid;    
    const hospital = new Hospital( { usuario: uid, ...req.body } );
        

    try{

    
        //guardar usuario
        const hospitalBD = await hospital.save();

        res.json({
            ok: true,            
            hospital: hospitalBD
        });


    }catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado .... revisar lógica'

        })
    }

    
}

const actualizarHospital = async(req, res = response) =>{

    //ToDo: Validar token y comprobar si es el usuario correcto

    const id  = req.params.id;
    const uid = req.uid; //Cuando nos logueamos se tiene el uid del usuario
    
    try{

        const hospitalBD = await Hospital.findById(id);

        if( !hospitalBD ){
            res.status(404).json({
                ok: false,
                msg: 'No existe hospital por ese ID'    
            });
        }

        //Actualizaciones
        const {  uid,  ...campos}  = req.body;


        /*if( hospitalBD.nombre !== nombre ){            
            const existeNombre = await Usuario.findOne({ nombre });
            if( existeNombre ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe hospital con ese nombre'    
                });
            }
        }*/

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, campos, {new: true});

        res.json({
            ok: true,
            msg: 'hospital actualizado',
            hospital: hospitalActualizado
        });


    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado .... revisar lógica del update'

        });


    }

}

const borrarHospital = async(req, res = response) =>{

    const uid = req.params.id;
    try{

       const hospitalBD = await Hospital.findById(uid);

        if( !hospitalBD ){
            res.status(404).json({
                ok: false,
                msg: 'No existe hospital por ese ID'    
            });
        }

        await Hospital.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error no se puede eliminar Hospital .... revisar lógica'

        });

    }


}


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital

}