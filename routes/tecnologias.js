const TecnologiaMongoDao = require("~/dao/TecnologiaMongoDao");

module.exports = app => {
    const tecnologiaDao = new TecnologiaMongoDao()

    app.route('/tecnologias')
        .get(async (req, res) => {
            try {
                let tecnologiaList = await tecnologiaDao.findAll();
                res.json(tecnologiaList);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

};
