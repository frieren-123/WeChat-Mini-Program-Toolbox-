const { cloudImages } = require('../../utils/cloud-images.js');

Page({
  data: {
    currentTab: 'tools',
    hasSchedule: false,
    todayCourses: [],
    todayDate: '',
    tools: [
      {
        id: 'calc',
        name: '计算器',
        desc: '基础数字计算',
        iconPath: cloudImages.homeCards.card001,
        color: '#F9A825',
        bg: '#FFFDE7',
        pagePath: '/package-tools/pages/calculator/index'
      },
      {
        id: 'unit',
        name: '单位换算',
        desc: '常用单位转换',
        iconPath: cloudImages.local.icon002,
        color: '#1565C0',
        bg: '#E3F2FD',
        pagePath: '/package-tools/pages/unit-convert/index'
      },
      {
        id: 'qr',
        name: '二维码',
        desc: '生成专属二维码',
        iconPath: cloudImages.local.icon003,
        color: '#424242',
        bg: '#FAFAFA',
        pagePath: '/package-tools/pages/qr-generator/index'
      },
      {
        id: 'random',
        name: '帮我选',
        desc: '解决选择困难症',
        iconPath: cloudImages.local.icon004,
        color: '#7B1FA2',
        bg: '#F3E5F5',
        pagePath: '/package-tools/pages/random/index'
      },
      {
        id: 'pomo',
        name: '番茄钟',
        desc: '保持专注效率',
        iconPath: cloudImages.homeCards.card005,
        color: '#D32F2F',
        bg: '#FFCDD2',
        pagePath: '/package-tools/pages/pomodoro/index'
      },
      {
        id: 'ddl',
        name: '魔法委托',
        desc: 'DDL 倒计时管理',
        iconPath: cloudImages.homeCards.card007,
        color: '#00695C',
        bg: '#E0F2F1',
        pagePath: '/pages/ddl/index'
      },
      {
        id: 'fitness',
        name: '体测计算',
        desc: '大学生体测成绩',
        iconPath: cloudImages.local.icon008,
        color: '#2E7D32',
        bg: '#E8F5E9',
        pagePath: '/package-student/pages/fitness/index'
      },
      {
        id: 'lottery',
        name: '群抽签',
        desc: '抓阄/分组/排序',
        iconPath: cloudImages.local.frieren004,
        color: '#1565C0',
        bg: '#E3F2FD',
        pagePath: '/package-tools/pages/lottery/index'
      }
    ]
  },

  onLoad() {
    this.updateTodayDate();
  },

  onShow() {
    // 检查是否有课表
    this.checkSchedule();
    
    // 更新自定义tabBar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      const selectedUniversity = wx.getStorageSync('selectedUniversity');
      const tabIndex = selectedUniversity ? 2 : 1;
      this.getTabBar().updateTabList();
      this.getTabBar().setData({ selected: tabIndex });
    }
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    
    if (tab === 'schedule') {
      this.checkSchedule();
    }
  },

  updateTodayDate() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[now.getDay()];
    this.setData({
      todayDate: `${month}月${day}日 ${weekday}`
    });
  },

  checkSchedule() {
    const schedule = wx.getStorageSync('courseSchedule');
    if (schedule && schedule.length > 0) {
      this.setData({ hasSchedule: true });
      this.getTodayCourses(schedule);
    } else {
      this.setData({ 
        hasSchedule: false,
        todayCourses: []
      });
    }
  },

  getTodayCourses(schedule) {
    const now = new Date();
    const dayIndex = now.getDay(); // 0-6, 0是周日
    const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayMap[dayIndex];
    
    const todayCourses = schedule.filter(course => course.day === today);
    todayCourses.sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });
    
    this.setData({ todayCourses });
  },

  goToSchedulePage() {
    wx.navigateTo({
      url: '/package-tools/pages/schedule/index'
    });
  },

  reimportSchedule() {
    wx.showModal({
      title: '重新导入',
      content: '确定要重新导入课表吗？当前课表将被覆盖。',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/package-tools/pages/schedule/index?reimport=true'
          });
        }
      }
    });
  },

  loadDemoSchedule() {
    // 加载示例课表数据
    const demoSchedule = [
      { name: '高等数学', day: 'monday', startTime: '08:00', endTime: '09:40', location: '教学楼A101' },
      { name: '大学英语', day: 'monday', startTime: '10:00', endTime: '11:40', location: '外语楼B203' },
      { name: '程序设计', day: 'tuesday', startTime: '14:00', endTime: '15:40', location: '计算机楼C301' },
      { name: '线性代数', day: 'wednesday', startTime: '08:00', endTime: '09:40', location: '教学楼A102' },
      { name: '大学物理', day: 'thursday', startTime: '10:00', endTime: '11:40', location: '理学楼D201' },
      { name: '体育课', day: 'friday', startTime: '14:00', endTime: '15:40', location: '体育馆' }
    ];
    
    wx.setStorageSync('courseSchedule', demoSchedule);
    this.setData({ hasSchedule: true });
    this.getTodayCourses(demoSchedule);
    wx.showToast({ title: '示例课表已加载', icon: 'none' });
  },

  onToolTap(e) {
    const path = e.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({
        url: path,
        fail: (err) => {
          console.error('Navigation failed:', err);
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      });
    }
  }
});
