const {Pool} = require('pg/lib')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'krmrhzb12',
    database: 'cqadb'
});

module.exports = pool
    




