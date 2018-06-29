const mysql = require('mysql');

let pool;

exports.openConnection = (dbConfig) => {
    pool = mysql.createPool(dbConfig);
}

exports.query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                reject(error);
                return;
            }
            connection.query(sql, (error, result) => {
                if (error) {
                    connection.rollback();
                    connection.release();
                    reject(error);
                    return;
                }
                connection.commit();   
                connection.release();
                resolve(result);
                return;
            });
        });
    });
}

exports.select = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                reject(error);
                return;
            }
            connection.query(sql, (error, rows) => {
                if (error) {
                    connection.release();
                    reject(error);
                    return;
                }   
                connection.release();
                resolve(rows);
                return;
            });
        });
    });
}
