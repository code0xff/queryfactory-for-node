const mysql = require('promise-mysql');

let pool;

exports.openConnection = (dbConfig) => {
    pool = mysql.createPool(dbConfig);
}

exports.select = async (sql) => {
    const conn = await pool.getConnection();
    const result = await conn.query(sql).catch(error => {
        conn.connection.release();
        throw error;
    });
    conn.connection.release();
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
    const conn = await pool.getConnection();
    conn.query(sql)
    .then((data) => {
        // console.log(data);
        conn.commit();
        conn.connection.release();
    })
    .catch(error => {
        conn.rollback();
        conn.connection.release();
        throw error;
    });
}

const querySync = async (sql) => {
    const conn = await pool.getConnection();
    const result = await conn.query(sql).catch(error => {
        conn.rollback();
        conn.connection.release();
        throw error;
    });
    // console.log(result);
    conn.commit();
    conn.connection.release();
}
