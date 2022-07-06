const moment = require('moment');
const Usuario = require("~/models/Usuario");
const UsuarioMongoDao = require("~/dao/UsuarioMongoDao");
const TarefaMongoDao = require("~/dao/TarefaMongoDao");
const jwt = require('jwt-simple');

describe('Routes: Tarefas', () => {
    const usuarioDao = new UsuarioMongoDao();
    const tarefaDao = new TarefaMongoDao()

    let token;
    let tarefaList;
    let tarefaFake;

    describe('GET /tarefas', () => {
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

            await tarefaDao.deleteAll();

            tarefaList = [
                {
                    "data": "2022-07-06",
                    "nome": "Estudar Node js",
                    "descricao": "Fazer backend de todolist com Node js",
                    "done": false,
                    "usuarioId": result.id
                },
                {
                    "data": "2022-07-10",
                    "nome": "Pagar despesas dia 10",
                    "descricao": "",
                    "done": true,
                    "usuarioId": result.id
                }
            ]

            for (const tarefa of tarefaList) {
                await tarefaDao.save(tarefa)
            }

        });
        describe('status 200', () => {
            it('Retorna lista de tarefas de um periodo', done => {
                request.get('/tarefas')
                    .set({ Authorization: `Bearer ${token}` })
                    .query({ inicio: '2022-07-01', fim: '2022-07-10' })
                    .expect(200)
                    .end((err, res) => {

                        expect(res.body).to.have.length(2);

                        for (let i = 0; i < res.body.length; i++) {
                            const tarefa = res.body[i]

                            expect(tarefa.id).not.to.be.null
                            expect(tarefa.nome).to.eql(tarefaList[i].nome);
                            expect(tarefa.descricao).to.eql(tarefaList[i].descricao);
                            expect(tarefa.done).to.eql(tarefaList[i].done);
                            expect(tarefa.usuarioId).to.eql(tarefaList[i].usuarioId);

                            const dataTarefa = moment.utc(tarefa.data).format('YYYY-MM-DD');
                            expect(dataTarefa).to.eql(tarefaList[i].data);
                        }

                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.get('/tarefas')
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe('POST /tarefas', () => {
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

            await tarefaDao.deleteAll();

            //cria uma tarefa para alteracao
            const tarefa = {
                "data": "2022-07-06",
                "nome": "Estudar Node js",
                "descricao": "Fazer backend de todolist com Node js",
                "done": false,
                "usuarioId": result.id
            }

            tarefaFake = await tarefaDao.save(tarefa)

        });
        describe('status 200', () => {
            it('Cadastra nova tarefa', done => {
                request.post('/tarefas')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "2022-07-06",
                        "nome": "Estudar Node js",
                        "descricao": "Fazer backend de todolist com Node js",
                        "done": false
                    })
                    .expect(200)
                    .end((err, res) => {
                        const tarefa = res.body

                        expect(tarefa.id).not.to.be.null
                        expect(tarefa.nome).to.eql("Estudar Node js");
                        expect(tarefa.descricao).to.eql("Fazer backend de todolist com Node js");
                        expect(tarefa.done).to.eql(false);

                        const data = moment.utc(tarefa.data).format('YYYY-MM-DD');
                        expect(data).to.eql("2022-07-06");

                        done(err);
                    });
            });
            it('Altera tarefa existente', done => {
                request.post('/tarefas')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "id": tarefaFake.id,
                        "data": "2022-07-07",
                        "nome": "Estudar Node js",
                        "descricao": "Fazer backend de todolist com Node js",
                        "done": true
                    })
                    .expect(200)
                    .end((err, res) => {
                        const tarefa = res.body

                        expect(tarefa.id).to.eql(tarefaFake.id);
                        expect(tarefa.nome).to.eql("Estudar Node js");
                        expect(tarefa.descricao).to.eql("Fazer backend de todolist com Node js");
                        expect(tarefa.done).to.eql(true);

                        const data = moment.utc(tarefa.data).format('YYYY-MM-DD');
                        expect(data).to.eql("2022-07-07");

                        done(err);
                    });
            });

        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.post('/tarefas')
                    .expect(401)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo data nao foi preenchido', done => {
                request.post('/tarefas')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "",
                        "nome": "Estudar Node js",
                        "descricao": "Fazer backend de todolist com Node js",
                        "done": true
                    })
                    .expect(412)
                    .end(done);
            });
        });
        describe('status 412', () => {
            it('Retorna erro quando o campo nome nao foi preenchido', done => {
                request.post('/tarefas')
                    .set({ Authorization: `Bearer ${token}` })
                    .send({
                        "data": "2022-07-07",
                        "nome": "",
                        "descricao": "Fazer backend de todolist com Node js",
                        "done": true
                    })
                    .expect(412)
                    .end(done);
            });
        });
    });

    describe('DELETE /tarefas/:id', () => {
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

            await tarefaDao.deleteAll();

            const tarefa = {
                "data": "2022-07-06",
                "nome": "Estudar Node js",
                "descricao": "Fazer backend de todolist com Node js",
                "done": false,
                "usuarioId": result.id
            }

            tarefaFake = await tarefaDao.save(tarefa)

        });
        describe('status 200', () => {
            it('Retorna OK', done => {
                request.delete(`/tarefas/${tarefaFake.id}`)
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
                request.delete(`/tarefas/${tarefaFake.id}`)
                    .expect(401)
                    .end(done);
            });
        });
    });

    describe('GET /tarefas/find', () => {
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

            await tarefaDao.deleteAll();

            tarefaList = [
                {
                    "data": "2022-07-06",
                    "nome": "Estudar Node js",
                    "descricao": "Fazer backend de todolist com Node js",
                    "done": true,
                    "usuarioId": result.id
                },
                {
                    "data": "2022-07-07",
                    "nome": "Estudar Spring boot",
                    "descricao": "",
                    "done": false,
                    "usuarioId": result.id
                },
                {
                    "data": "2022-07-10",
                    "nome": "Pagar despesas dia 10",
                    "descricao": "",
                    "done": true,
                    "usuarioId": result.id
                }
            ]

            for (const tarefa of tarefaList) {
                await tarefaDao.save(tarefa)
            }

        });
        describe('status 200', () => {
            it('Retorna lista de tarefas com palavra Estudar', done => {
                request.get('/tarefas/find')
                    .set({ Authorization: `Bearer ${token}` })
                    .query({ text: 'Estudar' })
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.length(2);

                        expect(res.body[0].id).not.to.be.null
                        expect(res.body[0].nome).to.eql("Estudar Node js");
                        expect(res.body[0].descricao).to.eql("Fazer backend de todolist com Node js");
                        expect(res.body[0].done).to.eql(true);
                        const data1 = moment.utc(res.body[0].data).format('YYYY-MM-DD');
                        expect(data1).to.eql("2022-07-06");

                        expect(res.body[1].id).not.to.be.null
                        expect(res.body[1].nome).to.eql("Estudar Spring boot");
                        expect(res.body[1].descricao).to.eql("");
                        expect(res.body[1].done).to.eql(false);
                        const data2 = moment.utc(res.body[1].data).format('YYYY-MM-DD');
                        expect(data2).to.eql("2022-07-07");

                        done(err);
                    });
            });
        });
        describe('status 401', () => {
            it('Retorna erro quando usuario nao foi autenticado', done => {
                request.get('/tarefas/find')
                    .expect(401)
                    .end(done);
            });
        });
    });

    after(async () => {
        await usuarioDao.deleteAll();
        await tarefaDao.deleteAll();
    });

});
