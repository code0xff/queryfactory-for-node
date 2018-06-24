const mapperHandler = require('./mapper-handler');
const connection = require('./db-connect');

let queryFactory = {};

exports.createQueryFactory = (projectPath, configPath) => {
    const config = mapperHandler.loadMapperConfig(projectPath, configPath);
    connection.openConnection(config.connection);
    queryFactory = mapperHandler.loadQueries(projectPath, config.mappers);
}

exports.select = async (key, param) => {
    const sql = getQuery('select', key, param);
    console.log(sql);

    const result = await connection.select(sql);
    return result;
}   

exports.insert = async (key, param) => {
    const sql = getQuery('insert', key, param);
    console.log(sql);

    await connection.insert(sql);
}
    
exports.update = async (key, param) => {
    const sql = getQuery('update', key, param);
    console.log(sql);

    await connection.update(sql);
}

exports.delete = async (key, param) => {
    const sql = getQuery('delete', key, param);
    console.log(sql);

    await connection.delete(sql);
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

exports.getQueryList = () => {
    return queryFactory;
}
