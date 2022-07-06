const Tarefa = require("~/models/Tarefa");
const mongoose = require('mongoose');
const MongoDaoAbstract = require("./MongoDaoAbstract")
const { Schema } = mongoose;

class TarefaMongoDao extends MongoDaoAbstract {

    static SCHEMA = Schema({
        data: {
            type: Date,
            required: true
        },
        nome: {
            type: String,
            required: true
        },
        descricao: {
            type: String,
            required: false
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
        return 'tarefas';
    }

    getSchema() {
        return TarefaMongoDao.SCHEMA;
    }

    createModel(json) {
        return new Tarefa(json);
    }

    async findAll(usuarioId, inicio, fim) {
        const query = { usuarioId: usuarioId, data: { $gte: inicio, $lt: fim } };
        const modelList = await this.find(query);
        return modelList
    }

    async findAllByNome(usuarioId, text) {
        const query = { usuarioId: usuarioId, nome:{ $regex : new RegExp(text, "i") } } 
        const modelList = await this.find(query);
        return modelList
    }
}

module.exports = TarefaMongoDao;