Page({
  data: {
    tools: [
      {
        id: 'calc',
        name: '计算器',
        desc: '基础数字计算',
        iconPath: '/images/001.jpg',
        color: '#F9A825', // 暖黄色文字
        bg: '#FFFDE7',    // 极浅黄色背景
        pagePath: '/package-tools/pages/calculator/index',
      },
      {
        id: 'unit',
        name: '单位换算',
        desc: '常用单位转换',
        iconPath: '/images/002.jpg',
        color: '#1565C0', // 蓝色文字
        bg: '#E3F2FD',    // 极浅蓝色背景
        pagePath: '/package-tools/pages/unit-convert/index',
      },
      {
        id: 'qr',
        name: '二维码',
        desc: '生成专属二维码',
        iconPath: '/images/003.jpg',
        color: '#424242', // 深灰色文字
        bg: '#FAFAFA',    // 接近白色的浅灰背景
        pagePath: '/package-tools/pages/qr-generator/index',
      },
      {
        id: 'random',
        name: '帮我选',
        desc: '解决选择困难症',
        iconPath: '/images/004.jpg',
        color: '#7B1FA2', // 紫色文字
        bg: '#F3E5F5',    // 浅紫色背景
        pagePath: '/package-tools/pages/random/index',
      },
      {
        id: 'pomo',
        name: '番茄钟',
        desc: '保持专注效率',
        iconPath: '/images/005.jpg',
        color: '#D32F2F', // 深红色
        bg: '#FFCDD2',    // 浅红色背景
        pagePath: '/package-tools/pages/pomodoro/index',
      }
    ]
  },

  onToolTap(e) {
    const path = e.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({
        url: path,
        fail: (err) => {
          console.error('Navigation failed:', err);
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      });
    }
  }
});
