import Event from './Event.js';

const app = getApp();

// 方法的共用和导出
export default class PageModule extends Event{
  constructor(data) {
    super();

    const pageExample = this;
    // 监听一个page的显示事件
    this.addEvent('onShow', function () {
      Reflect.set(app, 'page', {
        example: pageExample,
        page: this,
        route: this.route
      });
    });

    data && this.extend(data);
  }

  // 数据筛选
  static select(obj) {
    let events = {},
      data = {};
    
    Object.keys(obj).forEach(key => {
      if (/function/i.test(obj[key])) {
        events[key] = obj[key];
      } else {
        data[key] = obj[key];
      }
    });

    return {events, data};
  }

  // 导出事件方法
  /*
    exports()  ->  导出所有事件方法
    exports('f1', 'f2')  ->  导出指定事件方法
   */
  exports(...args) {
    args = args.length ? args : Object.keys(this.events);

    let events = {};
    args.forEach(eType => {
      if (/function/i.test(typeof this[eType])) {
        events[eType] = this.events[eType];
      } else {
        throw new Error(`${eType} 事件不存在`);
      }
    });
    return events;
  }

  // 导入实例
  extend(obj) {
    const {events, data} = PageModule.select(obj);

    // 添加事件
    for (let eType in events) {
      this.addEvent(eType, events[eType]);
    }

    // 添加属性
    Object.assign(this, data);
  }

  // 初始化
  start(data) {
    data && this.extend(data);

    Page(this);
  }
}