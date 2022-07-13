const ObjectUtil = require('./ObjectUtil');

class Tecnologia {

    constructor(json) {
        this.id = ''
        this.nome = ''
        this.tipo = ''

        if (json) {
            ObjectUtil.copy(this, json)
        }
    }
}

module.exports = Tecnologia;