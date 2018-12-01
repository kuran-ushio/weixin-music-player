# weixin-music-player
微信小程序版音乐播放器

## 声明
- 歌曲资源来源于QQ音乐，歌曲版权归QQ音乐所有。
- 本项目仅作个人学习交流使用！

## 功能介绍
- 分类歌单及歌曲列表
- 歌曲搜索及历史记录
- 音乐播放（上下首切换/列表循环方式）
- 显示歌词
- 歌曲收藏
- 歌曲评论（基于云开发）

## 如何使用
1. 使用微信web开发者工具打开，创建项目时填写你的AppID
2. 在项目配置文件 `project.config.json` 中配置云函数目录 `"cloudfunctionRoot": "functions/"` 
3. 在 `functions/addComment/index.js` 中指定了服务端的云开发环境，在 `common/const.js` 指定了小程序端的云开发环境
4. 在云开发的数据库中创建集合 `song_comment`
5. 请查阅微信小程序开发文档，保证云开发必需的 `wx-server-sdk` 已安装

## 更新日志
- v1.0.0
  基本功能完成
  
