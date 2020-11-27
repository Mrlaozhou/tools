const Collection = require('./lib/Collection');
const Data = require('./lib/data');

/**
 * Collection 助手函数
 *
 * @param data
 * @returns {Collection}
 */
function collect(data) {
    return new Collection(data);
}

module.exports =  {collect, Data};