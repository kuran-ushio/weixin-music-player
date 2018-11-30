// tabbar
export const tabbar = [
  { id: 0, title: "推荐" },
  { id: 1, title: "搜索" },
  { id: 2, title: "我的" }
];

// 首页推荐歌单
export const homeSheet = [
  { name: "流行音乐", id: 4 },
  { name: "热门歌曲", id: 26 },
  { name: "最新音乐", id: 27 },
  { name: "网络歌曲", id: 28 }
];

// 国家地区
export const region = [
  { name: "欧美", id: 3, icon: 'cd' },
  { name: "内地", id: 5, icon: 'music' },
  { name: "港台", id: 6, icon: 'fm' },
  { name: "韩国", id: 16, icon: 'earphone' },
  { name: "日本", id: 17, icon: 'microphone' }
];

// 歌曲循环方式
export const loopMode = [
  { icon: 'all-repeat', name: '列表循环' },
  { icon: 'shuffle', name: '随机播放' },
  { icon: 'single-repeat', name: '单曲循环' }
];

// 评论前的提示文字
export const commentTips = [
  '你可曾执笔写春秋？',
  '江湖浩荡，有幸与你相遇于此',
  '桃李春风，浊酒与谁共饮？',
  '且将心事付云村，此处尽知音。',
  '不愿醒来的梦，又呓语了什么',
  '惊鸿一瞥，是你的评论',
  '人间一梦，梦中如何？',
  '苦乐悲喜，在这里尽致淋漓',
  '夜雨青灯，知己评论处寻',
  '有故事，也需以歌来和',
  '随乐而起，有感而发',
  '千头万绪，落笔汇成评论一句',
  '听了这么多，可能你有话想说',
  '说点什么吧，也许Ta都听得到'
];

// 请求url
export const request = {
  host: 'https://api.atoz.ink/'
};
request.topid = request.host + 'topid/'; // 歌单
request.query = request.host + 'query/'; // 搜索
request.lyrics = request.host + 'lyrics/'; // 歌词
request.song_url = request.host + 'song_url/'; // 获取歌曲真实的url

// 云开发环境
export const envStr = 'test-742123';
export const envObj = {
  database: 'test-742123',
  storage: 'test-742123',
  functions: 'test-742123'
};