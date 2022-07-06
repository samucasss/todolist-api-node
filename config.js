const currentEnv = process.env.NODE_ENV || 'development';

const mongoDBURLs = {
    development: 'mongodb://localhost:27017/todolist',
    test: 'mongodb://localhost:27017/todolist-test'
};

const jwtSecret = 't0d0l1$t';

module.exports = {
    jwt: {
        secret: jwtSecret,
        options: { session: false }
    },
    mongoDBURL:	mongoDBURLs[currentEnv]
};
