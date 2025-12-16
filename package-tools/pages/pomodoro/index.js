const DEFAULT_WORK_TIME = 25;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

Page({
  data: {
    workTime: DEFAULT_WORK_TIME, // minutes
    timeLeft: DEFAULT_WORK_TIME * 60,
    timeStr: '25:00',
    isRunning: false,
    statusText: '准备开始',
  },

  timer: null,

  onTimeChange(e) {
    if (this.data.isRunning) return;
    const minutes = e.detail.value;
    this.setData({
      workTime: minutes,
      timeLeft: minutes * 60,
      timeStr: formatTime(minutes * 60)
    });
  },

  onToggleTimer() {
    if (this.data.isRunning) {
      this.stopTimer();
    } else {
      this.startTimer();
    }
  },

  startTimer() {
    this.setData({
      isRunning: true,
      statusText: '专注中...',
    });

    // Keep screen on
    wx.setKeepScreenOn({ keepScreenOn: true });

    this.timer = setInterval(() => {
      let { timeLeft } = this.data;
      if (timeLeft <= 0) {
        this.finishTimer();
        return;
      }
      timeLeft--;
      this.setData({
        timeLeft,
        timeStr: formatTime(timeLeft),
      });
    }, 1000);
  },

  stopTimer() {
    clearInterval(this.timer);
    this.timer = null;
    const resetSeconds = this.data.workTime * 60;
    this.setData({
      isRunning: false,
      timeLeft: resetSeconds,
      timeStr: formatTime(resetSeconds),
      statusText: '已放弃',
    });
    wx.setKeepScreenOn({ keepScreenOn: false });
  },

  finishTimer() {
    clearInterval(this.timer);
    this.timer = null;
    const resetSeconds = this.data.workTime * 60;
    this.setData({
      isRunning: false,
      timeLeft: resetSeconds,
      timeStr: formatTime(resetSeconds),
      statusText: '完成！休息一下',
    });
    
    wx.vibrateLong();
    wx.showModal({
      title: '专注完成',
      content: `恭喜你完成了${this.data.workTime}分钟专注！`,
      showCancel: false,
    });
    wx.setKeepScreenOn({ keepScreenOn: false });
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
});
