const { response } = require('express');
const bcrypt = require('bcryptjs');

const req = require('express/lib/request');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({},'nombre email role google');

    res.json({
        ok: true,
        usuarios
    });

}

const crearUsuario = async(req, res) => {

    //console.log( req.body);
    const { email, password } = req.body;

    

    try{

        const existeEmail = await Usuario.findOne({email});

        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
    
            });
        }

        const usuario = new Usuario( req.body );

        //Encriptar contraseña

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt)

        //guardar usuario
        await usuario.save();

        //Generar el token - JWT
        const token = await generarJWT( usuario.id );


        res.json({
            ok: true,
            usuario,
            token
        });


    }catch (error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado .... revisar lógica'

        })
    }

    
}

const actualizarUsuario = async(req, res = response) =>{

    //ToDo: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    
    try{

        const usuarioBD = await Usuario.findById(uid);

        if( !usuarioBD ){
            res.status(404).json({
                ok: false,
                msg: 'No existe usuario por ese ID'    
            });
        }

        //Actualizaciones
        const { password, google, email,  ...campos}  = req.body;

        if( usuarioBD.email !== email ){            
            const existeEmail = await Usuario.findOne({ email });
            if( existeEmail ){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe usuario con ese email'    
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado .... revisar lógica'

        });


    }

}

const borrarUsuario = async(req, res = response) =>{

    const uid = req.params.id;
    try{

        const usuarioBD = await Usuario.findById(uid);

        if( !usuarioBD ){
            res.status(404).json({
                ok: false,
                msg: 'No existe usuario por ese ID'    
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error no se puede eliminar usuario .... revisar lógica'

        });

    }


}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario

}