Page({
  data: {
    history: []
  },

  onShow() {
    const history = wx.getStorageSync('fitness_history') || [];
    this.setData({ history });
  }
});