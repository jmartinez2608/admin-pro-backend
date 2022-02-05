/*
PATH: 'api/login'
*/
const { Router } = require('express');
const { login, googleSignIn, renewToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();


router.post( '/', [

    check('email','El correo es obligatorio').isEmail(),
    check('password','La clave es obligatoria').notEmpty(),
    validarCampos


], login);


router.post( '/google', [
    check('token','El token es obligatorio').notEmpty(),    
    validarCampos
], googleSignIn);

router.get( '/renew', 
        validarJWT,
        renewToken);


module.exports = router;