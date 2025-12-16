Page({
  data: {
    tools: [
      {
        id: 'calc',
        name: '计算器',
        iconPath: '/images/001.jpg',
        color: '#FF9500',
        bg: '#FFF8E5',
        pagePath: '/package-tools/pages/calculator/index',
        enabled: true,
      },
      {
        id: 'unit',
        name: '单位换算',
        iconPath: '/images/002.jpg',
        color: '#007AFF',
        bg: '#E5F1FF',
        pagePath: '/package-tools/pages/unit-convert/index',
        enabled: true,
      },
      {
        id: 'qr',
        name: '二维码',
        iconPath: '/images/003.jpg',
        color: '#AF52DE',
        bg: '#F3E5F5',
        pagePath: '/package-tools/pages/qr-generator/index',
        enabled: true,
      },
      {
        id: 'random',
        name: '帮我选',
        iconPath: '/images/004.jpg',
        color: '#34C759',
        bg: '#E8F5E9',
        pagePath: '/package-tools/pages/random/index',
        enabled: true,
      },
      {
        id: 'pomo',
        name: '番茄钟',
        iconPath: '/images/005.jpg',
        color: '#FF3B30',
        bg: '#FFEBEE',
        pagePath: '/package-tools/pages/pomodoro/index',
        enabled: true,
      },
      {
        id: 'about',
        name: '关于',
        iconPath: '/images/006.jpg',
        color: '#8E8E93',
        bg: '#F2F2F7',
        pagePath: '/pages/about/index',
        enabled: true,
      },
    ],
  },

  onToolTap(e) {
    const index = e.currentTarget.dataset.index;
    const tool = this.data.tools[index];
    
    console.log('Tapped tool:', tool);

    if (!tool || !tool.enabled) {
      wx.showToast({
        title: '开发中',
        icon: 'none',
      });
      return;
    }

    wx.navigateTo({
      url: tool.pagePath,
      fail: (err) => {
        console.error('Navigation failed:', err);
        wx.showToast({
          title: '跳转失败',
          icon: 'none'
        });
      }
    });
  },
});
