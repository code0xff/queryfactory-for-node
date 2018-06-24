const mysql = require('promise-mysql');

let pool;

exports.openConnection = (dbConfig) => {
    pool = mysql.createPool(dbConfig);
}

exports.insert = async (sql) => {
    const connn = await pool.getConnection();
    await connn.query(sql).catch(error => {
        connn.connection.release();
        throw error;
    });
    connn.connection.release();
}

exports.delete = async (sql) => {
    const connn = await pool.getConnection();
    await connn.query(sql).catch(error => {
        connn.connection.release();
        throw error;
    });
    connn.connection.release();
}

exports.update = async (sql) => {
    const connn = await pool.getConnection();
    await connn.query(sql).catch(error => {
        connn.connection.release();
        throw error;
    });
    connn.connection.release();
}

exports.select = async (sql) => {
    const connn = await pool.getConnection();
    const result = await connn.query(sql).catch(error => {
        connn.connection.release();
        throw error;
    });
    connn.connection.release();
    return result;
}