Page({
  data: {
    cacheSize: '计算中...',
    showFeedbackModal: false,
    showChangelogModal: false,
    showLetterModal: false,
    showUploadModal: false,
    showClearModal: false,
    showPrivacyModal: false,
    showAgreementModal: false,
    feedbackType: 'suggest',
    feedbackContent: '',
    feedbackImages: [],
    // 上传校园信息相关
    uploadCategories: ['校园猫咪', '校园狗狗', '校园景点', '其他'],
    uploadCategoryIndex: 0,
    uploadName: '',
    uploadLocation: '',
    uploadDescription: '',
    uploadImages: [],
    changelog: [
      {
        version: '1.2.0',
        date: '2026-01-17',
        changes: [
          '新增扩展功能',
          '新增魔法委托功能',
          '新增群抽签功能',
          '新增体测计算功能',
          '新增课表功能',
          '计算器新增彩蛋'
        ]
      },
      {
        version: '1.1.0',
        date: '2025-12-25',
        changes: [
          'UI全新改版',
          '新增时间魔法',
          '新增宝箱怪',
          '字体优化'
        ]
      },
      {
        version: '1.0.0',
        date: '2025-12-20',
        changes: [
          '首页九宫格导航',
          '计算器工具',
          '单位换算工具',
          '二维码生成器'
        ]
      }
    ]
  },

  onLoad() {
    this.calculateCacheSize();
  },

  onShow() {
    this.calculateCacheSize();
    
    // 更新自定义tabBar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const selectedUniversity = wx.getStorageSync('selectedUniversity');
      const tabIndex = selectedUniversity ? 3 : 2;
      this.getTabBar().updateTabList();
      this.getTabBar().setData({ selected: tabIndex });
    }
  },

  // 计算缓存大小
  calculateCacheSize() {
    try {
      const info = wx.getStorageInfoSync();
      const sizeKB = info.currentSize;
      let sizeText;
      if (sizeKB < 1024) {
        sizeText = sizeKB + ' KB';
      } else {
        sizeText = (sizeKB / 1024).toFixed(2) + ' MB';
      }
      this.setData({ cacheSize: sizeText });
    } catch (e) {
      this.setData({ cacheSize: '未知' });
    }
  },

  // 打开反馈弹窗
  onFeedback() {
    this.setData({ 
      showFeedbackModal: true,
      feedbackType: 'suggest',
      feedbackContent: ''
    });
  },

  // 关闭反馈弹窗
  closeFeedbackModal() {
    this.setData({ showFeedbackModal: false });
  },

  // 选择反馈类型
  selectFeedbackType(e) {
    this.setData({ feedbackType: e.currentTarget.dataset.type });
  },

  // 输入反馈内容
  onFeedbackInput(e) {
    this.setData({ feedbackContent: e.detail.value });
  },

  // 提交反馈
  submitFeedback() {
    const { feedbackType, feedbackContent, feedbackImages } = this.data;
    if (!feedbackContent.trim()) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }
    
    // 这里可以将反馈发送到服务器
    // TODO: 接入后端API，支持图片上传
    console.log('反馈类型:', feedbackType, '内容:', feedbackContent, '图片:', feedbackImages);
    
    this.setData({ 
      showFeedbackModal: false,
      feedbackImages: []
    });
    wx.showToast({ 
      title: '反馈已收到，感谢您的建议~', 
      icon: 'none',
      duration: 3000
    });
  },

  // 选择反馈图片
  chooseFeedbackImage() {
    wx.chooseMedia({
      count: 3 - this.data.feedbackImages.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          feedbackImages: [...this.data.feedbackImages, ...newImages]
        });
      }
    });
  },

  // 删除反馈图片
  deleteFeedbackImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.feedbackImages;
    images.splice(index, 1);
    this.setData({ feedbackImages: images });
  },

  // 检查更新
  onCheckUpdate() {
    wx.showLoading({ title: '检查中...' });
    
    const updateManager = wx.getUpdateManager();
    
    updateManager.onCheckForUpdate((res) => {
      wx.hideLoading();
      if (res.hasUpdate) {
        wx.showModal({
          title: '发现新版本',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              updateManager.onUpdateReady(() => {
                updateManager.applyUpdate();
              });
            }
          }
        });
      } else {
        wx.showToast({ title: '已是最新版本 ✨', icon: 'none' });
      }
    });

    updateManager.onUpdateFailed(() => {
      wx.hideLoading();
      wx.showToast({ title: '更新失败，请稍后重试', icon: 'none' });
    });
  },

  // 显示更新日志
  onChangelog() {
    this.setData({ showChangelogModal: true });
  },

  // 关闭更新日志
  closeChangelogModal() {
    this.setData({ showChangelogModal: false });
  },

  // 清除缓存 - 打开自定义弹窗
  onClearCache() {
    this.setData({ showClearModal: true });
  },

  closeClearModal() {
    this.setData({ showClearModal: false });
  },

  confirmClearCache() {
    try {
      wx.clearStorageSync();
      this.calculateCacheSize();
      this.setData({ showClearModal: false });
      
      // 提示并重启小程序以应用更改
      wx.showModal({
        title: '清除成功',
        content: '缓存已清除，小程序将重新加载以应用更改。',
        showCancel: false,
        confirmText: '好的',
        success: () => {
           // 使用 reLaunch 重启并跳转回首页，强制重新加载数据
           wx.reLaunch({
             url: '/pages/home/index'
           });
        }
      });
      
    } catch (e) {
      wx.showToast({ title: '清除失败', icon: 'none' });
    }
  },

  // 隐私政策 - 打开自定义弹窗
  onPrivacyPolicy() {
    this.setData({ showPrivacyModal: true });
  },

  closePrivacyModal() {
    this.setData({ showPrivacyModal: false });
  },

  // 用户协议 - 打开自定义弹窗
  onUserAgreement() {
    this.setData({ showAgreementModal: true });
  },

  closeAgreementModal() {
    this.setData({ showAgreementModal: false });
  },

  // 复制微信号
  copyWechat() {
    wx.setClipboardData({
      data: 'abc3533055815',
      success: () => {
        wx.showToast({ title: '微信号已复制', icon: 'none' });
      }
    });
  },

  // 点击头像显示一封信
  onAvatarTap() {
    this.setData({ showLetterModal: true });
  },

  // 关闭信件弹窗
  closeLetterModal() {
    this.setData({ showLetterModal: false });
  },

  // 上传校园信息相关
  onUploadCampusInfo() {
    this.setData({ 
      showUploadModal: true,
      uploadCategoryIndex: 0,
      uploadName: '',
      uploadLocation: '',
      uploadDescription: '',
      uploadImages: []
    });
  },

  closeUploadModal() {
    this.setData({ showUploadModal: false });
  },

  onUploadCategoryChange(e) {
    this.setData({ uploadCategoryIndex: e.detail.value });
  },

  onUploadNameInput(e) {
    this.setData({ uploadName: e.detail.value });
  },

  onUploadLocationInput(e) {
    this.setData({ uploadLocation: e.detail.value });
  },

  onUploadDescInput(e) {
    this.setData({ uploadDescription: e.detail.value });
  },

  chooseUploadImage() {
    wx.chooseMedia({
      count: 3 - this.data.uploadImages.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          uploadImages: [...this.data.uploadImages, ...newImages]
        });
      }
    });
  },

  deleteUploadImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.uploadImages;
    images.splice(index, 1);
    this.setData({ uploadImages: images });
  },

  submitUpload() {
    const { uploadName, uploadLocation, uploadDescription, uploadImages, uploadCategories, uploadCategoryIndex } = this.data;
    
    if (!uploadName.trim()) {
      wx.showToast({ title: '请输入名称', icon: 'none' });
      return;
    }
    
    if (!uploadLocation.trim()) {
      wx.showToast({ title: '请输入位置', icon: 'none' });
      return;
    }
    
    if (uploadImages.length === 0) {
      wx.showToast({ title: '请至少上传一张图片', icon: 'none' });
      return;
    }
    
    // TODO: 接入后端API
    console.log('上传信息:', {
      category: uploadCategories[uploadCategoryIndex],
      name: uploadName,
      location: uploadLocation,
      description: uploadDescription,
      images: uploadImages
    });
    
    this.setData({ showUploadModal: false });
    wx.showToast({ 
      title: '提交成功，审核通过后将展示', 
      icon: 'none',
      duration: 3000
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: 'Frieren的万能口袋 - 一个可爱的小工具集',
      path: '/pages/home/index',
      imageUrl: '/images/frieren004.jpg'
    };
  },

  onShareTimeline() {
    return {
      title: 'Frieren的万能口袋',
      query: '',
      imageUrl: '/images/frieren004.jpg' 
    };
  },
  
  onShareTimelineTap() {
    wx.showModal({
      title: '分享到朋友圈',
      content: '请点击右上角三个点 "..." ，选择 "分享到朋友圈" 即可分享这份魔法 🪄',
      showCancel: false,
      confirmText: '知道啦',
      confirmColor: '#89C4E1'
    });
  }
});
