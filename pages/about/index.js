Page({
  onClearCache() {
    wx.showModal({
      title: '提示',
      content: '确定要清除所有本地缓存吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync();
            wx.showToast({ title: '清除成功', icon: 'success' });
          } catch (e) {
            wx.showToast({ title: '清除失败', icon: 'none' });
          }
        }
      }
    });
  },
});
