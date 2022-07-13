const Tecnologia = require("~/models/Tecnologia");
const mongoose = require('mongoose');
const MongoDaoAbstract = require("./MongoDaoAbstract")
const { Schema } = mongoose;

class TecnologiaMongoDao extends MongoDaoAbstract {

    static SCHEMA = Schema({
        nome: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            required: true
        },
    });

    constructor() {
        super()
    }

    getCollectionName() {
        return 'tecnologias';
    }

    getSchema() {
        return TecnologiaMongoDao.SCHEMA;
    }

    createModel(json) {
        return new Tecnologia(json);
    }

}

module.exports = TecnologiaMongoDao;