# javascript工具类合集

## Install
```shell script
npm install mrlzz-tools
```

## Collection
**用于JS数组数据类型操作

#### Example
```javascript
// import {collect, test_data} from 'mrlzz-tools';
import {collect, test_data} from './index';

// 创建集合
let user_coll = collect(test_data.user);

//  `groupBy` 分组
user_coll.groupBy('gender');
user_coll.groupBy('gender', false); // 不需要关联分组字段
user_coll.groupBy( (item)=> { retrun `${item.gender}-${item.status}`; } ); // 不需要关联分组字段

// `pluck` 获取集合中指定键对应的所有值
user_coll.pluck('email');
user_coll.pluck('email', 'name'); // 以name为键
user_coll.pluck( (item)=> { return item.age >= 18 ? '成年' : '小孩'; }, 'name' ); // 以name为键

//  魔术方法
//      获取集合第一个元素  等同
user_coll[1]
user_coll.get(1)
//      赋值第一个元素
user_coll[1] = 'changed'
//      判断第一个元素
2 in user_coll
user_coll.has(2)
//      删除第一个元素
delete user_coll[1]
user_coll.delete(1)
```
其余用法请看 `Collection.js`