Page({
  data: {
    scheduleImage: '',
    timeTableImage: '',
    courseSchedule: [],
    weekDays: [],
    todayCourses: [],
    todayStr: '',
    isLoading: false,
    hasSchedule: false,
    showConfirm: false,
    timeSlots: ['08:00-09:35', '10:05-11:40', '14:00-15:35', '16:05-17:40', '19:00-20:35']
  },

  onLoad() {
    this.loadSavedSchedule();
    this.updateTodayInfo();
  },

  onShow() {
    this.loadSavedSchedule();
    this.updateTodayInfo();
  },

  loadSavedSchedule() {
    const savedSchedule = wx.getStorageSync('courseSchedule');
    const savedImage = wx.getStorageSync('scheduleImage');
    
    if (savedSchedule && savedSchedule.length > 0) {
      this.setData({
        courseSchedule: savedSchedule,
        scheduleImage: savedImage || '',
        hasSchedule: true
      });
      this.organizeByWeekday(savedSchedule);
      this.getTodayCourses(savedSchedule);
    }
  },

  updateTodayInfo() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dayStr = weekDays[now.getDay()];
    this.setData({
      todayStr: `${month}月${date}日 ${dayStr}`
    });
  },

  organizeByWeekday(schedule) {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const weekDays = days.map(day => ({
      day: day,
      courses: schedule.filter(c => c.day === day)
    }));
    this.setData({ weekDays });
  },

  getTodayCourses(schedule) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = weekDays[dayOfWeek];
    
    let todayCourses = schedule.filter(c => c.day === today);
    
    // 按时间排序
    todayCourses.sort((a, b) => {
      const timeA = a.time.split('-')[0];
      const timeB = b.time.split('-')[0];
      return timeA.localeCompare(timeB);
    });

    // 标记当前正在上的课
    const currentTime = now.getHours() * 60 + now.getMinutes();
    todayCourses = todayCourses.map(course => {
      const [start, end] = course.time.split('-');
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;
      return {
        ...course,
        isCurrent: currentTime >= startMin && currentTime <= endMin
      };
    });
    
    this.setData({ todayCourses });
  },

  // 上传课表截图
  uploadSchedule() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ scheduleImage: tempFilePath });
        this.recognizeSchedule(tempFilePath);
      }
    });
  },

  // 上传作息时间表
  uploadTimeTable() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ timeTableImage: tempFilePath });
        wx.showToast({ title: '已添加作息表', icon: 'success' });
      }
    });
  },

  // 调用DeepSeek API识别课表
  recognizeSchedule(imagePath) {
    this.setData({ isLoading: true });
    
    wx.getFileSystemManager().readFile({
      filePath: imagePath,
      encoding: 'base64',
      success: (res) => {
        const base64Image = res.data;
        const apiKey = wx.getStorageSync('deepseek_api_key');
        
        if (!apiKey) {
          this.setData({ isLoading: false });
          wx.showModal({
            title: '未配置API',
            content: '请先配置DeepSeek API Key\n\n目前可使用示例课表体验功能',
            confirmText: '使用示例',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) {
                this.loadDemoSchedule();
              }
            }
          });
          return;
        }
        
        wx.request({
          url: 'https://api.deepseek.com/v1/chat/completions',
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          data: {
            model: 'deepseek-chat',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: '请识别这张课表图片，提取所有课程信息。以JSON数组格式返回，每个课程包含：name(课程名)、day(星期几，如"周一")、time(时间段，如"08:00-09:35")、room(教室)、weeks(周次，如"1-16周")。只返回JSON数组，不要其他文字。'
                  },
                  {
                    type: 'image_url',
                    image_url: {
                      url: 'data:image/jpeg;base64,' + base64Image
                    }
                  }
                ]
              }
            ]
          },
          success: (response) => {
            this.setData({ isLoading: false });
            
            if (response.data && response.data.choices && response.data.choices[0]) {
              try {
                const content = response.data.choices[0].message.content;
                const jsonMatch = content.match(/\[[\s\S]*\]/);
                if (jsonMatch) {
                  const schedule = JSON.parse(jsonMatch[0]);
                  this.showConfirmDialog(schedule);
                } else {
                  throw new Error('无法解析课表');
                }
              } catch (e) {
                wx.showToast({ title: '识别失败', icon: 'none' });
              }
            }
          },
          fail: () => {
            this.setData({ isLoading: false });
            wx.showToast({ title: '网络错误', icon: 'none' });
          }
        });
      }
    });
  },

  showConfirmDialog(schedule) {
    this.setData({ 
      courseSchedule: schedule,
      showConfirm: true
    });
    this.organizeByWeekday(schedule);
  },

  cancelConfirm() {
    this.setData({
      showConfirm: false,
      courseSchedule: [],
      scheduleImage: ''
    });
  },

  confirmSchedule() {
    this.saveSchedule();
    this.setData({ showConfirm: false });
    this.getTodayCourses(this.data.courseSchedule);
  },

  reuploadSchedule() {
    this.uploadSchedule();
  },

  // 加载示例课表
  loadDemoSchedule() {
    const demoSchedule = [
      { name: '高等数学', day: '周一', time: '08:00-09:35', room: '教A-301', weeks: '1-16周' },
      { name: '大学英语', day: '周一', time: '10:05-11:40', room: '教B-201', weeks: '1-16周' },
      { name: '程序设计', day: '周二', time: '08:00-09:35', room: '机房-102', weeks: '1-16周' },
      { name: '线性代数', day: '周二', time: '14:00-15:35', room: '教A-405', weeks: '1-16周' },
      { name: '大学物理', day: '周三', time: '10:05-11:40', room: '教C-101', weeks: '1-16周' },
      { name: '体育', day: '周四', time: '14:00-15:35', room: '体育馆', weeks: '1-16周' },
      { name: '思想政治', day: '周五', time: '08:00-09:35', room: '教A-101', weeks: '1-16周' }
    ];
    
    this.setData({
      courseSchedule: demoSchedule,
      hasSchedule: true,
      isLoading: false
    });
    
    this.organizeByWeekday(demoSchedule);
    this.getTodayCourses(demoSchedule);
    this.saveSchedule();
    
    wx.showToast({ title: '已加载示例', icon: 'success' });
  },

  // 保存课表
  saveSchedule() {
    const { courseSchedule, scheduleImage } = this.data;
    
    wx.setStorageSync('courseSchedule', courseSchedule);
    if (scheduleImage) {
      wx.setStorageSync('scheduleImage', scheduleImage);
    }
    
    this.setData({ hasSchedule: true });
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  // 清除课表
  clearSchedule() {
    wx.showModal({
      title: '确认清除',
      content: '课表数据将被永久删除，确定继续吗？',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('courseSchedule');
          wx.removeStorageSync('scheduleImage');
          
          this.setData({
            courseSchedule: [],
            weekDays: [],
            todayCourses: [],
            scheduleImage: '',
            hasSchedule: false
          });
          
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  },

  // 预览课表图片
  previewImage() {
    if (this.data.scheduleImage) {
      wx.previewImage({ urls: [this.data.scheduleImage] });
    }
  },

  // 获取指定日期和时间的课程（用于表格显示）
  getCourseByDayTime(day, timeSlot) {
    return this.data.courseSchedule.filter(c => c.day === day && c.time === timeSlot);
  }
});
