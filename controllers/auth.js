const { response } = require('express');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
const bcrypt = require('bcryptjs');



const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try{

        //Verificar email
        const usuarioDB = await Usuario.findOne({email});
        
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: 'Email no válido'
    
            });
        }

        //Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña No válida'
    
            });
        }

        //Generar el token - JWT
        const token = await generarJWT( usuarioDB.id );



        res.json({
            ok: true,
            token
        })


    }catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'

        });
    }

}

module.exports = { login }