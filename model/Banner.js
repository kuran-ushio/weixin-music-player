import AudioManager from '../lib/AudioManager.js';

// 广告图信息
export default class Banner{
  constructor(page) {
    Reflect.set(page, "actionBanner", Banner.actionBanner);
  }

  // 广告图跳转方法
  static actionBanner(e) {
    const action = e.currentTarget.dataset.action;

    switch (action.linkType) {
      case 0: // 专题
        wx.navigateTo({
          url: '/pages/sheet/list?id=' + action.data.id + '&name=' + action.data.name
        });
        break;
      case 1: // 单曲推荐
        AudioManager.setSong(action.data, [action.data]);

        wx.navigateTo({
          url: '/pages/player/index?name=' + action.data.song_name + '&mid=' + action.data.song_mid
        })
        break;
      default:
    }
  }

  // 获取广告图
  getBanner() {
    const data = [];

    // 专题
    data.push({
      img: 'http://p1.music.126.net/x1-BDEAsrRLDbDjFKLYk_A==/109951163623825668.jpg',
      linkType: 0,
      data: {
        id: 106,
        name: '韩国Mnet榜'
      }
    });

    // 单曲推荐
    data.push({
      img: 'http://p1.music.126.net/SHJTeNK5yryjzdTvUbA87w==/109951163626628064.jpg',
      linkType: 1,
      data: {
        song_url: 'http://ws.stream.qqmusic.qq.com/C1000049wFaT1l87EI.m4a?fromtag=0&guid=0',
        song_mid: '0049wFaT1l87EI',
        song_name: '夏恋模様',
        song_orig: '水樹奈々',
        album_min: 'https://y.gtimg.cn/music/photo_new/T002R90x90M000001tQUDu2tA8GH.jpg',
        album_big: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000001tQUDu2tA8GH.jpg',
        album_mid: '001tQUDu2tA8GH',
        album_name: 'IMPACT EXCITER'
      }
    });

    // 单曲推荐
    data.push({
      img: 'http://p1.music.126.net/eutlOcSlh-dtpWq328R6bQ==/109951163615791721.jpg',
      linkType: 1,
      data: {
        song_url: 'http://ws.stream.qqmusic.qq.com/C100001dPKD40OUxFz.m4a?fromtag=0&guid=0',
        song_mid: '001dPKD40OUxFz',
        song_name: '耳朵',
        song_orig: '李荣浩',
        album_min: 'https://y.gtimg.cn/music/photo_new/T002R90x90M000004QnEHc3zjC7J.jpg',
        album_big: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000004QnEHc3zjC7J.jpg',
        album_mid: '004QnEHc3zjC7J',
        album_name: '耳朵'
      }
    });

    return new Promise(resolve => {
      resolve(data);
    });
  }
}