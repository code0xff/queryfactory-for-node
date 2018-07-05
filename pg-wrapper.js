const pg = require('pg');

let client;

exports.openConnection = (dbConfig) => {
    client = new pg.Client(dbConfig);
    client.connect();
}

exports.query = (sql, param) => {
    const {pgOriginalSql, values} = restructureSql(sql, param);
    return new Promise((resolve, reject) => {
        client
        .query(pgOriginalSql, values, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });
}

exports.select = (sql, param) => {
    const {pgOriginalSql, values} = restructureSql(sql, param);
    return new Promise((resolve, reject) => {
        client
        .query(pgOriginalSql, values, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result.rows);
        });
    });
}

const restructureSql = (sql, param) => {
    let pgOriginalSql = sql;
    let values = [];
    if (param) {
        const keys = Object.keys(param);
    
        for (let i = 1; i <= keys.length; i++) {
            let key = keys[i - 1];
            pgOriginalSql = pgOriginalSql.replace(new RegExp(':' + key, 'g'), ('$' + i));
            values.push(param[key]);
        }
    }
    return {
        pgOriginalSql,
        values
    };
}
