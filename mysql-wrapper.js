const mysql = require('mysql');

let pool;

exports.openConnection = (dbConfig) => {
    pool = mysql.createPool(dbConfig);
}

exports.query = (sql, param, commit) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (connection.config.queryFormat !== customFormat) {
                connection.config.queryFormat = customFormat;
            }
            if (error) {
                reject(error);
                return;
            }
            connection.query(sql, param, (error, result) => {
                if (error) {
                    connection.rollback();
                    connection.release();
                    reject(error);
                    return;
                }
                if (commit) {
                    connection.commit();
                }
                connection.release();
                resolve(result);
                return;
            });
        });
    });
}

exports.select = (sql, param) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (connection.config.queryFormat !== customFormat) {
                connection.config.queryFormat = customFormat;
            }
            if (error) {
                reject(error);
                return;
            }
            connection.query(sql, param, (error, rows) => {
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

const customFormat = function (query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, function (txt, key) {
        if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
        }
        return txt;
    }.bind(this));
};