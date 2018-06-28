const mysql = require('promise-mysql');

let pool;

exports.openConnection = (dbConfig) => {
    pool = mysql.createPool(dbConfig);
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

exports.insertSync = async (sql) => {
    await querySync(sql);
}

exports.insert = (sql) => {
    query(sql);
}

exports.deleteSync = async (sql) => {
    await querySync(sql);
}

exports.delete = (sql) => {
    query(sql);
}

exports.updateSync = async (sql) => {
    await querySync(sql);
}

exports.update = (sql) => {
    query(sql);
}

const query = async (sql) => {
    const connn = await pool.getConnection();
    connn.query(sql)
    .then((data) => {
        // console.log(data);
        connn.connection.release();
    })
    .catch(error => {
        connn.connection.release();
        throw error;
    });
}

const querySync = async (sql) => {
    const connn = await pool.getConnection();
    const result = await connn.query(sql).catch(error => {
        connn.connection.release();
        throw error;
    });
    // console.log(result);
    connn.connection.release();
}