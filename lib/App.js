import Event from './Event.js';

let app;

// 公共数据的发送和保存
export default class AppModule extends Event{
  globalData = {};

  constructor() {
    super();
  }

  // 给当前页面设置数据（不用在实际显示的页面设置数据，通过assign代理直接给页面设置）
  static assign(key, value) {
    // 等待 app 和 page的onShow事件 执行
    if (!app || !app.page) {
      return setTimeout(AppModule.assign.bind(null,key,value), 0);
    }

    const page = app.page.page;
    let keyType = typeof key;

    if (/string/i.test(keyType) && value !== undefined) {
      page.setData({
        [key]: value
      });
    } else if(/object/i.test(keyType)) {
      page.setData(key);
    }
  }

  // 用于修改全局数据
  /*
    多态
    data()  ->  返回数据对象
    data('num')  ->  返回属性名为num的单条数据
    data('num', 3)  ->  设置
    data({num: 3, name: apple})  ->  设置
   */
  data(...args) {
    if(args.length === 0) {
      return this.globalData;
    } else if (args.length === 1) {
      let keyType = typeof args[0];

      if(/string/i.test(keyType)) {
        return this.globalData[args[0]];
      } else if (/object/i.test(keyType)) {
        for(let key in args[0]) {
          this.data(key, args[0][key]);
        }
      }
    } else {
      this.globalData[args[0]] = args[1];
    }
  }

  // 初始化
  start() {
    const appExample = this;
    // 监听一个app的加载事件
    this.oneEvent('onLaunch', function() {
      Reflect.set(this, 'example', appExample);
      app = this; // 获取app实例
    });

    // App方法调用的时候接受一个对象，会通过浅拷贝的方式将数据添加到app方法里
    App(this);
  }
}