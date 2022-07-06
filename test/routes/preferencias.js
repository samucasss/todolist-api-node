const moment = require('moment');
const Usuario = require("~/models/Usuario");
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");
const PreferenciasMongoDao = require("~/dao/PreferenciasMongoDao");
const jwt = require('jwt-simple');

describe('Routes: Preferencias', () => {
    const usuarioDao = new UsuarioMongoDao();
    const preferenciasDao = new PreferenciasMongoDao()

    let token;
    let preferenciaFake;

    describe('POST /preferencias', () => {
        beforeEach(async () => {
            await usuarioDao.deleteAll();

            const json = {
                nome: 'Samuel Santos',
                email: 'samuca.santos@gmail.com',
                senha: 'samuca'
            }
            const usuario = new Usuario(json)
            const result = await usuarioDao.save(usuario)

            token = jwt.encode({ id: result.id }, config.jwt.secret);

            await preferenciasDao.deleteAll();

            //cria uma tarefa para alteracao
            const preferencia = {
                "tipoFiltro": "H",
                "done": true,
                "usuarioId": result.id
            }

            preferenciaFake = await preferenciasDao.save(preferencia)

        });
        describe('status 200', () => {
            it('Cadastra nova preferencia', done => {
                request.post('/preferencias')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "tipoFiltro": "H",
                        "done": false,
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.id).not.to.be.null
                        expect(res.body.tipoFiltro).to.eql("H");
                        expect(res.body.done).to.eql(false);
                        done(err);
                    });
            });
            it('Altera preferencia', done => {
                request.post('/preferencias')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "id": preferenciaFake.id,
                        "tipoFiltro": "T",
                        "done": true,
                    })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.tipoFiltro).to.eql("T");
                        expect(res.body.done).to.eql(true);
                        done(err);
                    });
            });

        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.post('/preferencias')
                    .expect(401)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo tipoFiltro nao foi preenchido', done => {
                request.post('/preferencias')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "tipoFiltro": "",
                        "done": true,
                    })
                    .expect(412)
                    .end(done);
            });
        });
    });

    describe('DELETE /preferencia', () => {
        beforeEach(async () => {
            await usuarioDao.deleteAll();

            const json = {
                nome: 'Samuel Santos',
                email: 'samuca.santos@gmail.com',
                senha: 'samuca'
            }
            const usuario = new Usuario(json)
            const result = await usuarioDao.save(usuario)

            token = jwt.encode({ id: result.id }, config.jwt.secret);

            await preferenciasDao.deleteAll();

            const preferencia = {
                "tipoFiltro": "H",
                "done": true,
                "usuarioId": result.id
            }

            await preferenciasDao.save(preferencia)
        });
        describe('status 200', () => {
            it('Retorna OK', done => {
                request.delete('/preferencia')
                    .set({ Authorization: `Bearer ${token}` })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.eql('OK');
                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.delete('/preferencia')
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe('GET /preferencia', () => {
        beforeEach(async () => {
            await usuarioDao.deleteAll();

            const json = {
                nome: 'Samuel Santos',
                email: 'samuca.santos@gmail.com',
                senha: 'samuca'
            }
            const usuario = new Usuario(json)
            const result = await usuarioDao.save(usuario)

            token = jwt.encode({ id: result.id }, config.jwt.secret);

            const preferencia = {
                "tipoFiltro": "S",
                "done": false,
                "usuarioId": result.id
            }

            await preferenciasDao.save(preferencia)
        });
        describe('status 200', () => {
            it('Retorna preferencia do usuario logado', done => {
                request.get('/preferencia')
                    .set({ Authorization: `Bearer ${token}` })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.id).not.to.be.null
                        expect(res.body.tipoFiltro).to.eql("S");
                        expect(res.body.done).to.eql(false);
                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.get('/preferencia')
                    .expect(401)
                    .end(done);
            });
        });
    });

    after(async () => {
        await usuarioDao.deleteAll();
        await preferenciasDao.deleteAll();
    });

});
