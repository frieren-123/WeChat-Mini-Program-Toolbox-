Page({
  data: {
    name: '',
    date: '',
    startDate: '',
    remark: '',
    images: []
  },

  onLoad() {
    const today = new Date();
    const y = today.getFullYear();
    const m = (today.getMonth() + 1).toString().padStart(2, '0');
    const d = today.getDate().toString().padStart(2, '0');
    this.setData({
      startDate: `${y}-${m}-${d}`
    });
  },

  onNameInput(e) {
    this.setData({
      name: e.detail.value
    });
  },

  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  chooseImage() {
    const that = this;
    wx.chooseMedia({
      count: 9 - this.data.images.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFiles = res.tempFiles;
        const tempPaths = tempFiles.map(file => file.tempFilePath);
        that.setData({
          images: that.data.images.concat(tempPaths)
        });
      }
    });
  },

  previewImage(e) {
    const current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current,
      urls: this.data.images
    });
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({
      images: images
    });
  },

  saveTask() {
    const { name, date, remark, images } = this.data;
    
    if (!name.trim()) {
      wx.showToast({ title: '请输入委托内容', icon: 'none' });
      return;
    }
    
    if (!date) {
      wx.showToast({ title: '请选择截止日期', icon: 'none' });
      return;
    }

    // Save images to local storage (persistent)
    const fs = wx.getFileSystemManager();
    const savedImages = images.map(tempPath => {
      try {
        // Check if it's already a saved file (starts with user data path)
        if (tempPath.startsWith(wx.env.USER_DATA_PATH)) {
          return tempPath;
        }
        
        // Generate a unique file name
        const ext = tempPath.split('.').pop();
        const fileName = `ddl_img_${Date.now()}_${Math.random().toString(36).substr(2)}.${ext}`;
        const savedFilePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
        
        // Save the file
        fs.saveFileSync(tempPath, savedFilePath);
        return savedFilePath;
      } catch (e) {
        console.error('Save image failed', e);
        return tempPath; // Fallback to temp path if save fails
      }
    });

    const tasks = wx.getStorageSync('ddl_tasks') || [];
    const newTask = {
      id: Date.now(),
      name: name.trim(),
      date: date,
      remark: remark.trim(),
      images: savedImages,
      createTime: Date.now()
    };

    tasks.push(newTask);
    // 按日期排序
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    wx.setStorageSync('ddl_tasks', tasks);

    wx.showToast({ title: '委托已接受', icon: 'success' });
    
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});