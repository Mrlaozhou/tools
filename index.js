const Collection = require('./lib/Collection');
const test_data = require('./lib/data');

/**
 * Collection 助手函数
 *
 * @param data
 * @returns {Collection}
 */
function collect(data) {
    return new Collection(data);
}


module.exports =  {collect, test_data};