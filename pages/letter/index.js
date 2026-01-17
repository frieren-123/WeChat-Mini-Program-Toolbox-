Page({
  data: {},

  goBack() {
    wx.navigateBack({
      delta: 1,
      fail: () => {
        // 如果无法返回，则跳转到首页
        wx.switchTab({
          url: '/pages/home/index'
        });
      }
    });
  }
});
