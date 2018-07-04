const mysql = require('mysql');

let pool;

exports.openConnection = (dbConfig) => {
    pool = mysql.createPool(dbConfig);
}

exports.query = (sql, param) => {
    sql = insertParam(sql, param);
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

exports.select = (sql, param) => {
    sql = insertParam(sql, param);
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

const insertParam = (sql, param) => {
    if (!param) return sql;
    return sql.replace(/\:(\w+)/g, (txt, key) => {
        if (param.hasOwnProperty(key)) {
            return pool.escape(param[key]);
        }
        return txt;
    });
}
