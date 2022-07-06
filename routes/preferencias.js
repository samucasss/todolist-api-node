const PreferenciasMongoDao = require("~/dao/PreferenciasMongoDao");

module.exports = app => {
    const preferenciasDao = new PreferenciasMongoDao()

    app.route('/preferencias')
        .all(app.auth.authenticate())
        .post(async (req, res) => {
            try {
                const json = req.body
                const preferencias = ({ ...json, usuarioId: req.user.id })

                const result = await preferenciasDao.save(preferencias)
                res.json(result);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

    app.route('/preferencia')
        .all(app.auth.authenticate())
        .get(async (req, res) => {
            try {
                const result = await preferenciasDao.findByUsuario(req.user.id)
                res.json(result);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        })
        .delete(async (req, res) => {
            try {
                await preferenciasDao.deleteByUsuario(req.user.id);
                res.json('OK');

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

};
