import PageModule from '../../lib/Page.js';
import { request } from '../../common/const.js';
import $list from '../../model/PageList.js';
import $page_music from '../../model/PageMusic.js';

// pages/sheet/list.js
const $page = new PageModule($list);

$page.addEvent('onLoad', function (options) {
  wx.setNavigationBarTitle({
    title: options.name,
  });

  this.data.url = request.topid + options.id;

  this.loadPage();
});

$page.start($page_music);