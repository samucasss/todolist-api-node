const ObjectUtil = require('./ObjectUtil');

class Tarefa {

    constructor(json) {
        this.id = ''
        this.data = null
        this.nome = ''
        this.descricao = ''
        this.done = false
        this.usuarioId = ''

        if (json) {
            ObjectUtil.copy(this, json)
        }
    }
}

module.exports = Tarefa;