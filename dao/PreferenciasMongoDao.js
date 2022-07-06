const mongoose = require('mongoose');
const MongoDaoAbstract = require("./MongoDaoAbstract");
const Preferencias = require("../models/Preferencias");
const { Schema } = mongoose;

class PreferenciasMongoDao extends MongoDaoAbstract {

    static SCHEMA = Schema({
        tipoFiltro: {
            type: String,
            required: true
        },
        done: {
            type: Boolean,
            required: true
        },
        usuarioId: {
            type: String,
            required: true
        },
    });

    constructor() {
        super()
    }

    getCollectionName() {
        return 'preferencias';
    }

    getSchema() {
        return PreferenciasMongoDao.SCHEMA;
    }

    createModel(json) {
        return new Preferencias(json);
    }

    async findByUsuario(usuarioId) {
        const query = { usuarioId: usuarioId };
        const result = await this.findOne(query);
        return result
    }

    async deleteByUsuario(usuarioId) {
        await this.model.deleteOne({ usuarioId: usuarioId });
    }

    async save(json) {
        //remove o registro com o usuarioId
        await this.model.deleteOne({ usuarioId: json.usuarioId });

        let objMongo = await this.model.create(json)

        //adiciona a property id para o objeto
        let result = this.convert(objMongo)

        return this.createModel(result);
    }
}

module.exports = PreferenciasMongoDao;