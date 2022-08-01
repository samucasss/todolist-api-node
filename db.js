const config = require('./config');
const mongoose = require('mongoose');

module.exports = async () => {
    try {
        await mongoose.connect(config.mongoDBURL);
        console.log("Mongo iniciado com sucesso");

    } catch (error) {
        console.error("Erro ao conectar com o MongoDB: " + error);
    }
};
