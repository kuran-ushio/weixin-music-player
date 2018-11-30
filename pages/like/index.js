import PageModule from '../../lib/Page.js';
import $page_music from '../../model/PageMusic.js';
import LikeSong from '../../model/LikeSong.js';
import utils from '../../utils/utils.js';

const $like_db = new LikeSong(),
  default_album = '/images/default_album.jpg';

// pages/like/index.js
const $page = new PageModule({
  data: {
    likeList: []
  },
  onLoad() {
    utils.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      });
    });
  },
  onShow() {
    const likeList = $like_db.order('time', 'desc').all();

    this.setData({
      likeList,
      cover: likeList[0] ? likeList[0].album_big : default_album
    });
  },
  // 监听封面图资源加载出错
  coverError() {
    this.setData({
      cover: default_album_big
    });
  }
});

$page.start($page_music);