const { applyMagic } = require("js-magic");

/**
 * @name Collection
 * @author Luke
 * @description 提供一个更具可读性和更便于处理数组数据的封装
 */
class Collection {
    
    constructor(data) {
        if( data instanceof Array ) {
            this._DATA = data;
        } else {
            throw '集合初始化数据需要一个数组';
        }
    }
    
    /**
     * 静态方法快速创建集合
     *
     * @param data
     * @returns {Collection}
     */
    static init(data) {
        return new this(data);
    }
    
    /**
     * 用于合并集合项
     *
     */
    implode(field, separator=',') {
        return this.pluck(field).toArray().join(separator);
    }
    
    /**
     * 把指定的值追加到集合项的末尾
     *
     * @param item
     * @returns {number}
     */
    push (item) {
        return this._DATA.push(item);
    }
    
    /**
     * 传入的第一个参数为 true 时，将执行给定的回调函数
     *
     * @param condition
     * @param callFunc
     * @returns {*}
     */
    when(condition, callFunc) {
        return condition ? callFunc(this) : false;
    }
    
    /**
     * 将集合的键和对应的值进行互换
     *
     * @returns {[]}
     */
    flip() {
        let _result = [];
        this.foreach((item, key) => {
            _result[item] = key;
        })
        return _result;
    }
    
    /**
     * 以指定的键作为集合的键
     *
     * @param field
     * @returns {Collection}
     */
    keyBy(field) {
        let _result = [];
        this.foreach( (item) => {
            _result[item[field]] = item;
        } );
        return Collection.init(_result);
    }
    
    /**
     * 根据指定键对集合项进行分组
     *
     * @param field
     * @param assoc
     * @returns {Collection}
     */
    groupBy(field, assoc=true) {
        let _result = [],
            groupBy = (item) => {
                return field instanceof Function ?  field(item) : item[field];
        };
        this.foreach( (item) => {
            if( !_result[groupBy(item)] ) {
                _result[groupBy(item)] = [];
            }
            _result[groupBy(item)].push(item);
        } );
        return assoc ? Collection.init(_result) : Collection.init(_result).values();
    }
    
    /**
     * 返回集合中给定索引开始后面的部分
     *
     * @param start
     * @param end
     * @returns {Collection}
     */
    slice(start, end) {
        return Collection.init(this._DATA.slice(start, end));
    }
    
    /**
     * 通过给定的键 / 值对过滤集合
     *
     * @param field
     * @param value
     * @returns {Collection}
     */
    where(field, value=undefined) {
        let callFunc = field instanceof Function ? field : (item) => {return item[field] === value;};
        return this.filter( callFunc )
    }
    
    /**
     * 包含给定数组的键 / 值对来过滤集合
     *
     * @param field
     * @param values
     * @returns {Collection}
     */
    whereIn(field, values) {
        let callFunc = (item) => {return values.includes(item[field]);};
        return this.filter( callFunc )
    }
    
    /**
     * 用给定的范围对集合进行过滤
     *
     * @param field
     * @param interval
     * @returns {Collection}
     */
    whereBetween(field, interval) {
        let callFunc = (item) => {return (parseInt(item[field]) >= interval[0]) && (interval[1] >= parseInt(item[field]));};
        return this.filter( callFunc )
    }
    
    /**
     * 将给定的 数组 或集合值追加到集合的末尾
     *
     * @param arr
     * @returns {Collection}
     */
    concat(arr) {
        return Collection.init(this._DATA.concat(arr))
    }
    
    /**
     * 将一个集合的值作为键，再将另一个数组或集合的值作为值合并成一个集合
     *
     * @param collect
     * @returns {{}}
     */
    combine(collect) {
        let _result = {};
        this.foreach( (item, index) => {
            _result[item] = collect[index];
        } );
        return _result;
    }
    
    /**
     * 集合中搜索给定的字段、值并返回结果
     *
     * @param field
     * @param value
     * @returns {Collection}
     */
    search(field, value) {
        return this.filter( (item) => {return item[field].indexOf(value) !== -1;} );
    }
    
    /**
     * 将每次迭代的结果传递给下一次迭代直到集合减少为单个值
     *
     * @param callback
     * @returns {*}
     */
    reduce(callback) {
        return this._DATA.reduce(callback);
    }
    
    /**
     * 将集合拆成多个给定大小的小集
     *
     * @param size
     * @returns {Collection}
     */
    chunk(size) {
        let group = Math.ceil(this.length() / size),
            _result = [];
        for (let i = 0; i < group; i++) {
            let start = i * size, end = start + size;
            _result.push( this.slice(start, end) );
        }
        return Collection.init(_result);
    }
    
    /**
     * 使用给定的回调函数过滤集合
     *
     * @param callback
     * @returns {Collection}
     */
    filter(callback=undefined) {
        let _result = [];
        callback = callback ? callback : function (item) {return item;};
        this.foreach((item) => {
            callback(item) && _result.push(item);
        });
        return Collection.init(_result);
    }
    
    /**
     * 获取集合中指定键对应的所有值
     *
     * @param field
     * @param key
     * @returns {Collection}
     */
    pluck(field, key=undefined) {
        return this.foreach(
            field instanceof Function ? (item) => {return field(item)} : (item)=> {return item[field];}
            , key ? key instanceof Function ? (item) => {return key(item)} : (item) => {return item[key];} : undefined
        );
    }
    
    /**
     * 返回键被重置为连续编号的新集合
     *
     * @returns {Collection}
     */
    values() {
        let _values = [];
        this.foreach((item, key) => {_values.push(item)});
        return Collection.init(_values);
    }
    
    /**
     * 返回集合中所有的键
     *
     * @returns {Collection}
     */
    keys() {
        let _keys = [];
        this.foreach((item, key) => {_keys.push(key)});
        return Collection.init(_keys);
    }
    
    /**
     * 遍历数组元素
     *
     * @param valueFunc
     * @param keyFunc
     * @returns {Collection}
     */
    foreach(valueFunc, keyFunc=undefined) {
        let _result = [];
        if( keyFunc ) {
            Array.prototype.forEach.call(this._DATA,function(item, key){
                return _result[keyFunc(item)] = valueFunc(item, key);
            });
        } else {
            Array.prototype.forEach.call(this._DATA,function(item, key){
                return _result.push( valueFunc(item, key) );
            });
        }
        return Collection.init(_result);
    }
    
    /**
     * 将集合转换成 js 数组
     *
     * @returns {Array}
     */
    toArray() {
        let _resultArray = [];
        this.foreach( (item) => {
            _resultArray.push( item instanceof Collection ? item.toArray() : item );
        } );
        return _resultArray;
    }
    
    /**
     * 是否为空
     *
     * @returns {boolean}
     */
    isEmpty() {
        return this._DATA.length === 0;
    }
    
    /**
     * 是否不为空
     *
     * @returns {boolean}
     */
    isNotEmpty() {
        return ! this.isEmpty();
    }
    
    /**
     * 长度
     *
     * @returns {number}
     */
    length() {
        return this._DATA.length;
    }
    
    /**
     * 获取键缩对应的值
     *
     * @param key
     * @returns {*}
     */
    get(key) {
        return this._DATA[key];
    }
    
    /**
     * 判断key是否存在
     *
     * @param key
     * @returns {boolean}
     */
    has(key) {
        return key in this._DATA;
    }
    
    /**
     * 删除元素
     *
     * @param key
     * @returns {boolean}
     */
    delete(key) {
        return delete this._DATA[key];
    }
    
    /**
     * @魔术方法
     *
     * @param key
     * @returns {*}
     * @private
     */
    __get(key) {
        return this.get(key)
    }
    
    /**
     * @魔术方法
     *
     * @param key
     * @param value
     * @private
     */
    __set(key, value) {
        this._DATA[key] = value;
    }
    
    /**
     * @魔术方法
     *
     * @param key
     * @returns {boolean}
     * @private
     */
    __has(key) {
       return this.has(key);
    }
    
    /**
     * @魔术方法
     *
     * @param key
     * @returns {boolean}
     * @private
     */
    __delete(key) {
        return this.delete(key);
    }
}

module.exports =  applyMagic(Collection);