Page({
  data: {
    tasks: [],
    totalCount: 0
  },

  onShow() {
    this.loadTasks();
  },

  loadTasks() {
    const tasks = wx.getStorageSync('ddl_tasks') || [];
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Reset today's time to 00:00:00 for accurate day calculation
    const todayNoTime = new Date();
    todayNoTime.setHours(0, 0, 0, 0);

    const tasksWithDiff = tasks.map(task => {
      // Handle date string parsing manually to avoid timezone issues if possible, 
      // but standard Date constructor works for YYYY-MM-DD usually in local time in browsers/webview
      // Better to split and create date
      const parts = task.date.split('-');
      const targetDate = new Date(parts[0], parts[1] - 1, parts[2]);
      
      const diffTime = targetDate - todayNoTime;
      const daysLeft = Math.ceil(diffTime / oneDay);
      
      // Format date string
      const dateStr = `${targetDate.getMonth() + 1}月${targetDate.getDate()}日`;

      return {
        ...task,
        dateStr,
        daysLeft: daysLeft,
        urgent: daysLeft <= 3 && daysLeft >= 0 // Mark as urgent if within 3 days
      };
    });
    
    this.setData({
      tasks: tasksWithDiff,
      totalCount: tasksWithDiff.length
    });
  },

  addTask() {
    wx.navigateTo({
      url: '/pages/ddl/create/index'
    });
  },

  editTask(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/ddl/detail/index?id=${id}`
    });
  },

  deleteTask(id) {
    const tasks = wx.getStorageSync('ddl_tasks') || [];
    const newTasks = tasks.filter(t => t.id !== id);
    wx.setStorageSync('ddl_tasks', newTasks);
    this.loadTasks();
    wx.showToast({ title: '已删除', icon: 'none' });
  }
});