const catData = {
  north: [
    {
      id: 1,
      name: '小橘',
      avatar: '/images/005.jpg',
      photos: ['/images/005.jpg', '/images/006.jpg', '/images/007.jpg'],
      location: '图书馆门口',
      gender: '公',
      age: '约2岁',
      neutered: '已绝育',
      hasSpouse: '无',
      activeArea: '图书馆、食堂附近',
      habits: '喜欢在阳光下打盹，对人友好，会主动蹭人'
    },
    {
      id: 2,
      name: '花花',
      avatar: '/images/006.jpg',
      photos: ['/images/006.jpg', '/images/007.jpg', '/images/008.jpg'],
      location: '教学楼A区',
      gender: '母',
      age: '约1.5岁',
      neutered: '已绝育',
      hasSpouse: '无',
      activeArea: '教学楼A区草坪',
      habits: '比较胆小，喜欢躲在灌木丛里'
    },
    {
      id: 3,
      name: '大黄',
      avatar: '/images/007.jpg',
      photos: ['/images/007.jpg', '/images/008.jpg', '/images/005.jpg'],
      location: '宿舍区',
      gender: '公',
      age: '约3岁',
      neutered: '已绝育',
      hasSpouse: '无',
      activeArea: '宿舍楼下、快递站',
      habits: '是这片区域的"猫老大"，性格温和但有领地意识'
    },
    {
      id: 4,
      name: '小白',
      avatar: '/images/008.jpg',
      photos: ['/images/008.jpg', '/images/005.jpg', '/images/006.jpg'],
      location: '操场边',
      gender: '母',
      age: '约1岁',
      neutered: '未绝育',
      hasSpouse: '无',
      activeArea: '操场、体育馆周边',
      habits: '非常亲人，喜欢被摸头'
    }
  ],
  south: [
    {
      id: 5,
      name: '三花',
      avatar: '/images/009.jpg',
      photos: ['/images/009.jpg', '/images/010.jpg'],
      location: '行政楼',
      gender: '母',
      age: '约2岁',
      neutered: '已绝育',
      hasSpouse: '无',
      activeArea: '行政楼花园',
      habits: '优雅高冷，只接受特定人的投喂'
    },
    {
      id: 6,
      name: '煤球',
      avatar: '/images/010.jpg',
      photos: ['/images/010.jpg', '/images/009.jpg'],
      location: '实验楼',
      gender: '公',
      age: '约2.5岁',
      neutered: '已绝育',
      hasSpouse: '无',
      activeArea: '实验楼后面',
      habits: '全身黑色，晚上几乎看不见，喜欢夜间活动'
    }
  ]
};

Page({
  data: {
    cat: null,
    currentPhotoIndex: 0
  },

  onLoad(options) {
    const { id, campus } = options;
    const cats = catData[campus] || [];
    const cat = cats.find(c => c.id === parseInt(id));
    
    if (cat) {
      this.setData({ cat });
      wx.setNavigationBarTitle({ title: cat.name });
    }
  },

  onSwiperChange(e) {
    this.setData({ currentPhotoIndex: e.detail.current });
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.cat.photos
    });
  }
});
