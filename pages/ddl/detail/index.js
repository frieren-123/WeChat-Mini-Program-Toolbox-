Page({
  data: {
    task: null
  },

  onLoad(options) {
    if (options.id) {
      this.loadTask(options.id);
    }
  },

  loadTask(id) {
    const tasks = wx.getStorageSync('ddl_tasks') || [];
    // id from options is string, task.id is number
    const task = tasks.find(t => t.id == id);
    
    if (task) {
      // Calculate days left again to be sure
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Handle date parsing
      const parts = task.date.split('-');
      const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
      
      const oneDay = 24 * 60 * 60 * 1000;
      const diffTime = targetDate - today;
      const daysLeft = Math.ceil(diffTime / oneDay);

      this.setData({
        task: {
          ...task,
          daysLeft: daysLeft,
          urgent: daysLeft <= 3 && daysLeft >= 0
        }
      });
    } else {
      wx.showToast({ title: '任务不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.task.images
    });
  },

  deleteTask() {
    const that = this;
    wx.showModal({
      title: '确认放弃',
      content: '确定要放弃这个委托吗？',
      confirmColor: '#D32F2F',
      success(res) {
        if (res.confirm) {
          const tasks = wx.getStorageSync('ddl_tasks') || [];
          const newTasks = tasks.filter(t => t.id != that.data.task.id);
          wx.setStorageSync('ddl_tasks', newTasks);
          
          wx.showToast({ title: '已放弃', icon: 'success' });
          setTimeout(() => wx.navigateBack(), 1500);
        }
      }
    });
  }
});