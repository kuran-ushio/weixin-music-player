import Array from './ArrayExtend.js';

// 事件的类
export default class Event{
  constructor() {
    // 用来保存事件监听的类型和方法
    Object.defineProperty(this, 'events', {
      value: {},
      enumerable: false
    });
  }

  // 事件队列的触发器
  static createEventHandler(eType, that) {
    // 生成触发器的包装函数
    Reflect.set(that, eType, function(...args) {
      const page = this,
        eTypeFn = Array.from(that.getEvent(eType)); // 拷贝一份事件队列的方法
      
      let data = [];

      // 触发事件 递归事件队列
      (function recursion() {
        // 事件队列出列，每次出列第一个
        let fn = eTypeFn.shift();
        fn && data.pushNamespace(fn.apply(page, args)); // 微信小程序中的函数自执行，this指向本身
        
        // 事件队列不为空，则递归
        eTypeFn.length && recursion();
      })()
      
      return data;
    });
  }

  // 获取事件队列
  getEvent(eType) {
    let eTypeFn = Reflect.get(this.events, eType);

    // 判断该事件类型的队列是否为空
    if (!Array.isArray(eTypeFn)) {
      eTypeFn = [];
      Reflect.set(this.events, eType, eTypeFn);

      // 生成触发器
      Event.createEventHandler(eType, this);
    }
    return eTypeFn;
  }

  // 添加一个事件监听
  addEvent(eType, callback) {
    const eTypeFn = this.getEvent(eType);
    eTypeFn.push(callback);
  }

  // 删除一个事件监听
  removeEvent(eType, callback) {
    // 带callback是指定删除某个事件监听
    if(callback) {
      const eTypeFn = this.getEvent(eType);
      let index = eTypeFn.findIndex(item => item === callback);
      index != -1 && eTypeFn.splice(index, 1);
    } else {
      Reflect.set(this.events, eType, []);
    }
  }

  // 一次性事件
  oneEvent(eType, callback) {
    const that = this;
    // 事件监听方法的包装函数
    let handler = function(...args) {
      callback.apply(this, args);
      that.removeEvent(eType, handler);
    };
    this.addEvent(eType, handler);
  }
}