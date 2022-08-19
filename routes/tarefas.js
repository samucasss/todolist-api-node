const moment = require('moment')
const TarefaMongoDao = require("~/dao/TarefaMongoDao");

module.exports = app => {
    const tarefaDao = new TarefaMongoDao()

    app.route('/tarefas')
        .all(app.auth.authenticate())
        .get(async (req, res) => {
            const { inicio, fim } = req.query;

            if (!inicio || !fim) {
                res.status(412).json({ msg: 'parâmetros inicio e fim não informados' });
                return;
            }

            const inicioDate = moment(inicio, 'YYYY-MM-DD').toDate();
            const fimDate = moment(fim, 'YYYY-MM-DD').toDate();

            try {
                let tarefaList = await tarefaDao.findAll(req.user.id, inicioDate, fimDate);
                tarefaList = tarefaList.sort((a, b) => {
                    return a.data < b.data
                });

                res.json(tarefaList);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        })
        .post(async (req, res) => {
            try {
                const json = req.body

                const tarefa = ({ ...json, usuarioId: req.user.id })
                const result = await tarefaDao.save(tarefa)

                res.json(result);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

    app.route('/tarefas/:id')
        .all(app.auth.authenticate())
        .delete(async (req, res) => {
            try {
                await tarefaDao.delete(req.params.id);
                res.json('OK');
            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

    app.route('/tarefas/find')
        .all(app.auth.authenticate())
        .get(async (req, res) => {
            const { text } = req.query;

            if (!text) {
                res.status(412).json({ msg: 'parâmetro text não informado' });
                return;
            }

            try {
                let tarefaList = await tarefaDao.findAllByNome(req.user.id, text);
                tarefaList = tarefaList.sort((a, b) => {
                    return a.data < b.data
                });

                res.json(tarefaList);

            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

    app.route('/tarefas/done/:id')
        .all(app.auth.authenticate())
        .post(async (req, res) => {
            try {
                const { done } = req.body

                if (done == null) {
                    res.status(412).json({ msg: 'parâmetro done não informado' });
                    return;
                }
    
                await tarefaDao.done(req.params.id, done);
                res.json('OK');
            } catch (err) {
                res.status(412).json({ msg: err.message });
            }
        });

};
