const Collection = require('./lib/Collection');

/**
 * Collection 助手函数
 *
 * @param data
 * @returns {Collection}
 */
function collect(data) {
    return new Collection(data);
}


module.exports =  {collect};