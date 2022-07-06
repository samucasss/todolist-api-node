const ObjectUtil = require('./ObjectUtil');

class Preferencias {

    constructor(json) {
        this.id = null
        this.tipoFiltro = ''
        this.done = false
        this.usuarioId = ''

        if (json) {
            ObjectUtil.copy(this, json)
        }
    }
}

module.exports = Preferencias;