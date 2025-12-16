Page({
  data: {
    text: '',
    options: [],
    currentOption: '',
    isRunning: false,
  },

  timer: null,

  onInput(e) {
    const text = e.detail.value;
    // Split by newline or comma (Chinese or English)
    const options = text.split(/[\n,，]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.setData({
      text,
      options
    });
  },

  onStart() {
    const { options, isRunning } = this.data;

    if (options.length < 2) {
      wx.showToast({ title: '至少输入2个选项', icon: 'none' });
      return;
    }

    if (isRunning) {
      // Allow manual stop if needed, though we have auto-stop
      this.stop();
    } else {
      this.start();
    }
  },

  start() {
    this.setData({ isRunning: true });
    const { options } = this.data;

    // Fast loop animation
    this.timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      this.setData({ currentOption: options[randomIndex] });
    }, 50);

    // Auto stop after 2 seconds
    setTimeout(() => {
      this.stop();
    }, 2000);
  },

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.setData({ isRunning: false });
    // Vibrate to indicate result
    wx.vibrateShort();
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
});
