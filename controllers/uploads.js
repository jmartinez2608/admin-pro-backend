const path = require('path');
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');


const fileUpload = async(req, res = response) => {

    const   tipo = req.params.tipo;
    const   id = req.params.id;

    //Validar tipo

    const tiposValidos = ['usuarios', 'medicos', 'hospitales'];

    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            mes: 'No es un medico, usuario u hospital (tipo)'
        });
    }

    //Validar que exista el archivo
    if (!req.files || Object.keys(req.files).length === 0) {        
        return res.status(400).json({
            ok: false,
            msg: 'Sin archivo para cargar.'
        });
    }

    //Procesar imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length-1 ];

    //Validar extensión
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            mes: 'No es tipo de archvio permitido'
        });
    }

    //Generar Nombre de archivo
    const nombreArchivo =  `${ uuidv4() }.${ extensionArchivo }`

    //Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // Mover la imagen
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                mes: 'Error al mover la imagen'
            });
        }

        //Actualizar BD
        actualizarImagen( tipo, id, nombreArchivo );
        

        res.json({
            ok: true,
            msg: 'Archivo cargado',
            nombreArchivo
        });
    });
   

}

const retornaImagen = (req, res = response) =>{

    const   tipo = req.params.tipo;
    const   foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${tipo}/${foto}` );

    if( fs.existsSync( pathImg )){
        res.sendFile(pathImg);
    }else{
        pathImg = path.join( __dirname, `../uploads/img_default.png` );
        res.sendFile(pathImgDefault);
    }

    
}


module.exports = {
    fileUpload,
    retornaImagen

}