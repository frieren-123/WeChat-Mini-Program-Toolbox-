Page({
  data: {
    text: '',
    qrUrl: '',
  },

  onInput(e) {
    this.setData({ text: e.detail.value });
  },

  onGenerate() {
    const content = this.data.text.trim();
    if (!content) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '生成中...' });

    // 使用公共 API 生成二维码 (适合新手，无需引入复杂 JS 库)
    // 实际项目中可替换为本地 canvas 绘制方案
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(content)}`;

    this.setData({
      qrUrl: apiUrl,
    }, () => {
      wx.hideLoading();
    });
  },
});
