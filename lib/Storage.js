const whereCompare = {
  // 判断相等的情况
  '=': function(that, value) {
    return that == value;
  },

  // 不等于
  '!=': function (that, value) {
    return that != value;
  },

  // 大于
  '>': function (that, value) {
    return that > value;
  },

  // 大于等于
  '>=': function (that, value) {
    return that >= value;
  },

  // 小于
  '<': function (that, value) {
    return that < value;
  },

  // 小于等于
  '<=': function (that, value) {
    return that <= value;
  },

  // 模糊匹配
  'like': function(that, value) {
    return new RegExp(value, 'i').test(that);
  }
}

// 离线缓存类
export default class Storage {
  constructor(dbName) {
    Object.assign(this, {
      dbName, // 数据库名
      cache: { // 类的缓存，存档和读档
        add: {
          data: []
        }
      }
    })
  }

  // 实时获取类中数据库的数据
  static getDB(dbName) {
    return wx.getStorageSync(dbName) || [];
  }

  // 获取where函数
  static getWhere(action) {
    if(this.whereFn) {
      const whereFn = this.whereFn;
      this.whereFn = null;
      return whereFn;
    } else {
      throw new Error(`调用 ${action} 方法前，请先调用 where 方法查询`);
    }
  }

  // 构建条件查询语句
  /*
    两种传参方式
    db.where('name', 'Carry').where('id', '>', 1)
    db.where({ name: 'Carry', id: ['>', 1] })
   */
  where(...args) {
    let [key, compare, value] = args;

    // 若传入的参数是对象
    if (/object/i.test(typeof key)) {
      for(let k in key){
        if (Array.isArray(key[k])) {
          this.where(k, ...key[k]);
        } else {
          this.where(k, key[k]);
        }
      }
    }

    if(value == undefined) { // compare不传则默认为'='
      value = [compare, compare = '='][0];
    }

    // 获取对比方法
    const compareFn = whereCompare[compare];
    if(compareFn) { // 判断用户传入的是否为当前类支持的对比方式
      if (!this.whereFn) { // 第1次构建查询语句
        // 构建where查询函数
        const whereFn = (item) => {
          let compareNum = 0; // 本条数据满足的查询条件个数

          // 对每一条数据分别去匹配所有查询条件，此处查询条件是AND的关系
          whereFn.compare.forEach(compare => {
            compareNum += ~~compare.compareFn(item[compare.key], compare.value);
          });

          // 若该条数据满足所有查询条件，则符合要求
          return compareNum === whereFn.compare.length;
        }

        whereFn.compare = []; // 用于保存对比方式
        this.whereFn = whereFn;
      }

      // 记录当前的对比方式
      this.whereFn.compare.push({
        key, value, compareFn
      });
    } else {
      throw new Error(`where 不支持 ${compare} 的对比方式`);
    }
    return this;
  }

  // 添加数据
  add(data) {
    if(Array.isArray(data)) { // 数据是数组，则循环递归本身
      data.forEach(item => {
        this.add(item);
      })
    } else if(/object/.test(typeof data)) { // 数据是对象则直接添加
      // 添加至新增缓存
      this.cache.add.data.push(data);
    } else {
      throw new Error('add 方法仅接受对象作为参数');
    }
    return this;
  }

  // 删除数据
  del() {
    this.cache.del = {
      where: Storage.getWhere.call(this, 'del')
    }
    return this;
  }

  // 修改数据
  update(data) {
    if(/object/i.test(typeof data)) {
      this.cache.update = {
        data,
        where: Storage.getWhere.call(this, 'update')
      }
    } else {
      throw new Error('update 方法仅接受对象作为参数');
    }
    return this;
  }

  // 查询所有数据
  all() {
    const db = Storage.getDB(this.dbName);
    
    this.sortFn && db.sort(this.sortFn); // 若需要排序
    return db;
  }

  // 查询一条数据
  find() {
    const db = Storage.getDB(this.dbName);
    this.sortFn && db.sort(this.sortFn); // 若需要排序

    let data = Storage.getWhere.call(this, 'find');
    return db.find(data);
  }

  // 查询多条数据
  select() {
    const db = Storage.getDB(this.dbName);
    let data = db.filter(Storage.getWhere.call(this, 'select'));

    this.sortFn && data.sort(this.sortFn); // 若需要排序
    return this.sliceArgs ? data.slice(...this.sliceArgs) : data; // 若需要截取
  }
  
  // 排序
  order(key, sort='asc') {
    this.sortFn = (a, b) => {
      return /desc/i.test(sort) ? b[key] - a[key] : a[key] - b[key];
    }
    return this;
  }

  // 截取数据
  limit(start, length) {
    let end;
    if(length === undefined) {
      start = [0, end = start][0];
    } else {
      end = --start + length;
    }
    this.sliceArgs = [start, end];
    return this;
  }

  // 缓存更新至本地数据
  save() {
    // 先从本地拿数据，然后缓存合并保存
    let db = Storage.getDB(this.dbName);

    if(this.cache.del) { // 若存在del数据缓存
      db = db.filter(item => {
        return !this.cache.del.where(item);
      })
    }

    if(this.cache.update) { // 若存在update数据缓存
      db.forEach(item => {
        if(this.cache.update.where(item)) {
          Object.assign(item, this.cache.update.data);
        }
      });
    }
    
    if(this.cache.add.data.length > 0) { // 若存在add数据缓存
      db.push(...this.cache.add.data);
    }

    // 更新本地缓存
    wx.setStorageSync(this.dbName, db);

    // 更新类的缓存
    this.cache = {
      add: {
        data: []
      }
    };

    return this;
  }
}