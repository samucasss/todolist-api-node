const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");
const Usuario = require("~/models/Usuario");

module.exports = app => {
    const usuarioDao = new UsuarioMongoDao()

    app.route('/usuario')
        .all(app.auth.authenticate())
        .post(async (req, res) => {
            try {
                const json = req.body
                const usuario = new Usuario(json);
                usuario.id = req.user.id

                const result = await usuarioDao.save(usuario)
                res.json(result.toJson());

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        })
        .delete(async (req, res) => {
            try {
                await usuarioDao.delete(req.user.id);
                res.json('OK');

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });


};
