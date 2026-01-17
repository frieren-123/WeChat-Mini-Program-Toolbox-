Page({
  data: {
    currentCategory: 'travel',
    
    categories: [
      { id: 'travel', name: '旅行', icon: '✈️' },
      { id: 'scenery', name: '风景', icon: '🏞️' },
      { id: 'anime', name: '动漫', icon: '🎬' },
      { id: 'waifu', name: '角色', icon: '💕' },
      { id: 'music', name: '歌曲', icon: '🎵' },
      { id: 'cats', name: '小猫', icon: '🐱' },
      { id: 'dogs', name: '小狗', icon: '🐕' },
      { id: 'sunset', name: '黄昏', icon: '🌅' }
    ],
    
    // 旅行数据
    travels: [
      {
        id: 1,
        name: '北京',
        image: '/images/001.jpg',
        date: '2024年',
        companion: '独自',
        description: '第一次去北京，感受首都的魅力'
      }
    ],
    
    // 风景数据
    sceneries: [
      {
        id: 1,
        name: '校园夕阳',
        image: '/images/013.jpg',
        location: '河南理工大学'
      }
    ],
    
    // 动漫数据
    animes: [
      {
        id: 1,
        name: '葬送的芙莉莲',
        image: '/images/frieren004.jpg',
        genre: '奇幻 / 冒险'
      },
      {
        id: 2,
        name: '四月是你的谎言',
        image: '/images/002.jpg',
        genre: '音乐 / 爱情'
      }
    ],
    
    // 喜欢的角色
    waifus: [
      {
        id: 1,
        name: '芙莉莲',
        image: '/images/frieren004.jpg',
        anime: '葬送的芙莉莲'
      }
    ],
    
    // 歌曲数据
    musics: [
      {
        id: 1,
        name: '勇者',
        artist: 'YOASOBI'
      },
      {
        id: 2,
        name: '祝福',
        artist: 'YOASOBI'
      },
      {
        id: 3,
        name: 'Blinding Sunrise',
        artist: 'Evan Call'
      }
    ],
    
    // 小猫数据
    cats: [
      {
        id: 1,
        name: '橘猫',
        image: '/images/005.jpg',
        location: '校园'
      }
    ],
    
    // 小狗数据
    dogs: [],
    
    // 黄昏数据
    sunsets: [
      {
        id: 1,
        name: '冬日黄昏',
        image: '/images/013.jpg',
        date: '2025年12月',
        location: '焦作'
      }
    ]
  },

  onLoad() {
    // 页面加载时的初始化
  },

  onShow() {
    // 更新自定义tabBar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().updateTabList();
      this.getTabBar().setData({ selected: 1 });
    }
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
  },

  viewItemDetail(e) {
    const { id, category } = e.currentTarget.dataset;
    // 可以跳转到详情页
    wx.showToast({
      title: '查看详情',
      icon: 'none'
    });
  }
});