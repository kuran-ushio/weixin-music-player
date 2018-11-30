import AppModule from './lib/App.js';
import { envStr } from './common/const.js';

// 云开发初始化
wx.cloud.init({
  env: envStr
});

const $app = new AppModule();

$app.start();