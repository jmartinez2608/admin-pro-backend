const mongoose = require('mongoose');



const dbConnection = async() => {

    try{
        mongoose.connect(process.env.DB_CNN);

        console.log('Base de datos online');

    }catch(error){
        console.log(error);
        throw new Error('Erro a la hora de inciar la BD ver logs');
    }


}

module.exports = {
    dbConnection
}