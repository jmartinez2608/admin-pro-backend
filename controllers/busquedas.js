//get todo

const { response } = require('express');

const Usuario = require('../models/Usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/Medico');

const getBusqueda = async(req, res = response ) => {
    
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');    
    
    try{
       
        const [ usuarios, medicos, hospitales ] =  await Promise.all([
            Usuario.find({ nombre: regex }), 
            Medico.find({ nombre: regex }),
            Hospital.find({ nombre: regex }),
        ]);
    
    res.json({
        ok: true,
        msg: 'buscar todo',
        usuarios,
        medicos,
        hospitales
    });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado .... revisar lógica'

        })
    }

}


const getDocumentosColeccion = async(req, res = response ) => {
    
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');
    let data = [];
    
    try{
       
        switch (tabla) {
            case 'medicos':
                data = await Medico.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
                break;
            case 'hospitales':
                data = await Hospital.find({ nombre: regex })
                                    .populate('usuario', 'nombre img');
                break;
            case 'usuarios':
                data = await Usuario.find({ nombre: regex });
                break;    
            default:
                return res.status(500).json({
                    ok: false,
                    msg: 'La tabla debe ser usuarios/medicos/hopsitales'
        
                })
                break;
        }
    
        res.json({
            ok: true,
            msg: 'buscar por coleccion',
            data
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado .... revisar lógica'

        })
    }

}


module.exports = {
    getBusqueda,
    getDocumentosColeccion
}