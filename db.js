const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',//
    host: 'localhost',
    database: 'registration_login_db',
    password: 'admin',
    port: 5432,
});

pool.connect((err)=>{
    if(err){
        console.error("connection error", err.stack);
    }
    else{
        console.log("Connected");
    }
})
module.exports = pool;
