const { getScenery, getCreatures } = require('../../utils/cloud-db.js');

Page({
  data: {
    currentCampus: 'south',
    currentCategory: 'scenery', // 默认展示风景
    
    categories: [
      { id: 'scenery', name: '风景', icon: '🌸' },
      { id: 'creatures', name: '生灵', icon: '🐱' },
      { id: 'letter', name: '心意', icon: '💌' } // 恢复为心意，ID为letter
    ],
    
    // 生灵数据（从云数据库加载）
    creatures: [],
    
    // 风景数据（从云数据库加载）
    sceneries: [],
    
    displayList: [],
    loading: true
  },

  onLoad() {
    // 延迟加载数据（等待云开发初始化）
    setTimeout(() => {
      this.loadData();
    }, 1500);
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().updateTabList();
      this.getTabBar().setData({ selected: 1 });
    }
  },

  /**
   * 从云数据库加载数据
   */
  async loadData() {
    // 不显示系统loading，使用自定义loading
    
    try {
      // 并行加载南北校区的风景和生灵
      const [southScenery, northScenery, southCreatures, northCreatures] = await Promise.all([
        getScenery('south'),
        getScenery('north'),
        getCreatures('south'),
        getCreatures('north')
      ]);
      
      // 合并数据并转换格式
      const sceneries = [...southScenery, ...northScenery].map(item => ({
        id: item._id,
        name: item.name,
        image: item.imageUrl,
        location: item.campus === 'south' ? '南校区' : '北校区',
        campus: item.campus
      }));
      
      const creatures = [...southCreatures, ...northCreatures].map(item => ({
        id: item._id,
        name: item.name,
        image: item.imageUrl,
        location: item.campus === 'south' ? '南校区' : '北校区',
        campus: item.campus,
        description: item.description || ''
      }));
      
      this.setData({ 
        sceneries,
        creatures,
        loading: false
      });
      
      this.updateDisplayList();
      
      console.log('数据加载成功:', { sceneries: sceneries.length, creatures: creatures.length });
    } catch (err) {
      console.error('加载数据失败:', err);
      wx.showToast({ title: '数据加载失败，请稍后重试', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  switchCampus(e) {
    const campus = e.currentTarget.dataset.campus;
    this.setData({ currentCampus: campus });
    this.updateDisplayList();
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.updateDisplayList();
  },

  updateDisplayList() {
    const { currentCategory, currentCampus, creatures, sceneries } = this.data;
    let list = [];

    // 筛选逻辑
    if (currentCategory === 'creatures') {
      list = creatures.filter(c => c.campus === currentCampus);
    } else if (currentCategory === 'scenery') {
      list = sceneries.filter(s => s.campus === currentCampus);
    }
    
    this.setData({ displayList: list });
  },

  copyWechat() {
    wx.setClipboardData({
      data: 'abc3533055815',
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      }
    });
  },

  onShareAppMessage() {
    return {
      title: 'Frieren的万能口袋 - 校园风光',
      path: '/pages/university/index',
      imageUrl: '/images/frieren004.jpg'
    };
  },

  onShareTimeline() {
    return {
      title: 'Frieren的万能口袋 - 校园风光',
      imageUrl: '/images/frieren004.jpg'
    };
  },

  viewDetail(e) {
    const { id } = e.currentTarget.dataset;
    const { currentCategory, displayList } = this.data;
    
    // 无论是风景还是生灵，都只预览大图，不提供下载
    const item = displayList.find(i => i.id == id);
    if(item && item.image) {
      wx.previewImage({
        urls: [item.image],
        current: item.image,
        showmenu: false // 不显示菜单（转发/保存等）
      });
    }
  }
});
