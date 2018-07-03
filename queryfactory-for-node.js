const jsonHandler = require('./json-handler');
let connection;

let queryFactory = {};

exports.createQueryFactory = (projectPath, configPath) => {
    const config = jsonHandler.loadMapperConfig(projectPath, configPath);
    const module = setConnection(config.database);
    connection = require(module);
    if (connection) {
        connection.openConnection(config.connection);
    } else {
        console.log('database informaiton is not valid. please check database name.(you can only use mysql, postgresql.)')
    }
    queryFactory = jsonHandler.loadQueries(projectPath, config.mappers);
}

exports.insert = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('insert', key, param);

        connection.query(sql)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

exports.select = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('select', key, param);

        connection.select(sql)
        .then((data) => {
            resolve(data);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

exports.update = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('update', key, param);

        connection.query(sql)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

exports.delete = (key, param) => {
    return new Promise((resolve, reject) => {
        const sql = getQuery('delete', key, param);

        connection.query(sql)
        .then((result) => {
            resolve(result);
        })
        .catch((error) => {
            reject(error);
        });
    });
}

const insertParamIntoSQL = (sql, param) => {
    if (param !== undefined) {
        for (let key in param) {
            sql = sql.replace(new RegExp('#{' + key + '}', 'gi'), "'" + param[key] + "'");
        }
    }
    return sql;
}

const getQuery = (type, key, param) => {
    if (queryFactory[type][key] === undefined) {
        console.log(key + ' is not in ' + type + ' queries. please check mapper file.');
        return;
    }
    return insertParamIntoSQL(queryFactory[type][key], param);
}

const setConnection = (param) => {
    const database = param.toLowerCase();
    switch (database) {
        case 'mysql':
            return './mysql-wrapper';
        case 'postgresql':
            return './pg-wrapper';
        default:
            return false;
    }
}

exports.getQueryList = () => {
    return queryFactory;
}
