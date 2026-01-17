const { getAppNotice, shouldShowNotice, markNoticeShown } = require('./utils/cloud-db.js');

App({
  globalData: {
    appName: 'Toolbox',
    cloudInitialized: false, // 云开发是否初始化成功
  },

  onLaunch() {
    // 初始化云开发
    this.initCloud();
  },

  // 注意：通知功能已移到 pages/home/index.js 中显示

  /**
   * 初始化云开发
   */
  initCloud() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
      wx.showToast({
        title: '当前微信版本过低，部分功能可能无法使用',
        icon: 'none',
        duration: 3000
      });
      return;
    }

    try {
      wx.cloud.init({
        // 云环境ID
        env: 'frieren-cloud-0gd6n3lr386ef01d',
        traceUser: true,
      });
      
      this.globalData.cloudInitialized = true;
      console.log('云开发初始化成功');
      
    } catch (err) {
      console.error('云开发初始化失败:', err);
      wx.showToast({
        title: '云服务初始化失败',
        icon: 'none'
      });
    }
  },

  /**
   * 检查云开发是否可用
   */
  checkCloudAvailable() {
    return this.globalData.cloudInitialized;
  }
});
