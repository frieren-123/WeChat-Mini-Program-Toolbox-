const app = getApp();
const { getBanners } = require('../../utils/cloud-db.js');
const { getAppNotice, shouldShowNotice, markNoticeShown } = require('../../utils/cloud-db.js');

// 本地台词库（带出处）
const ANIME_QUOTES = [
  { text: "我们并不是想在童话故事里流芳百世，而是想确实地存在于大家的记忆之中。", source: "《葬送的芙莉莲》" },
  { text: "活的越是绝望，写的词越是温柔，这也许是世间最大的讽刺。", source: "《银魂》" },
  { text: "人总有一天会死的，但正因为生命是有限的，才能够欢喜和悲伤。", source: "《葬送的芙莉莲》" },
  { text: "如果不去遍历世界，我们就不知道什么是我们精神和情感的寄托。", source: "《葬送的芙莉莲》" },
  { text: "奇迹不是免费的，如果你祈求了希望，也会散播出同等的绝望。", source: "《魔法少女小圆》" },
  { text: "不管夜晚多么黑暗，黎明总是会到来。", source: "《四月是你的谎言》" },
  { text: "梦总是有会醒来的时候，不会醒的梦总有一天会变成悲伤。", source: "《AIR》" },
  { text: "我并不羡慕别人的人生，这就是所谓幸福。", source: "《哆啦A梦》" },
  { text: "即使是虚假的感情，只要将其视为真实，那便是真实。", source: "《我的青春恋爱物语果然有问题》" },
  { text: "只要有想见的人，就不再是孤单一人了。", source: "《夏目友人帐》" },
  { text: "为了不让已失的血白流，我们只能继续前进。", source: "《进击的巨人》" }
];

// 弹窗装饰头像库（使用本地小图标）
const WISH_AVATARS = [
  '/images/frieren004.jpg',
  '/images/frieren005.jpg'
];

Page({
  data: {
    nickName: '唯',
    greeting: '',
    quote: {}, 
    randomImage: '',
    showWishModal: false,
    showPasswordModal: false,
    showCalendarModal: false,
    showMimicModal: false,
    mimicMessage: '',
    yearProgress: 0,
    mimicStatus: '点击开箱',
    wishAvatar: '/images/frieren004.jpg',
    
    // 通知弹窗相关
    showNotice: false,
    noticeTitle: '',
    noticeContent: '',
    showDontShowAgain: false,
    noticeVersion: '',
    
    // 大学选择相关
    universities: ['Nothing (切回默认)', '河南理工大学', '旅时手记', 'Himmel'],
    universityIndex: [0],
    selectedUniversity: '',
    
    // 密码验证相关
    passwordTitle: '',
    passwordHint: '',
    passwordPlaceholder: '',
    passwordInput: '',
    pendingUniversity: '',
    passwordError: false,
    
    // 课表提醒
    currentCourse: null,
    
    // 日历相关
    calendarYear: 2026,
    calendarMonth: 1,
    calendarDays: [],
    importantDates: [],
    importantDateCountdown: '',
    
    // 添加日期弹窗相关
    showAddDateModal: false,
    newEventName: '',
    newEventDate: '',
    
    // 旅时手记开发中弹窗
    showJourneyDevModal: false,
  },

  onLoad() {
    const savedName = wx.getStorageSync('nickName');
    if (savedName) {
      this.setData({ nickName: savedName });
    }
    
    // 读取已选择的大学
    const savedUniversity = wx.getStorageSync('selectedUniversity');
    if (savedUniversity) {
      this.setData({ selectedUniversity: savedUniversity });
    }
    
    // 读取重要日期
    const savedDates = wx.getStorageSync('importantDates');
    if (savedDates) {
      this.setData({ importantDates: savedDates });
    }
    
    this.updateGreeting();
    this.calculateYearProgress();
    this.checkCurrentCourse();
    this.initCalendar();
    this.updateImportantDateCountdown();
    
    // 先尝试从缓存加载横幅（避免闪烁）
    this.loadCachedBanner();
    
    // 延迟加载云端内容（等待云开发初始化）
    setTimeout(() => {
      this.refreshContent();
      this.checkAndShowNotice(); // 检查并显示通知
    }, 1500);
  },
  
  // 检查并显示通知
  async checkAndShowNotice() {
    try {
      const shouldShow = await shouldShowNotice();
      
      if (shouldShow) {
        const notice = await getAppNotice();
        
        if (notice) {
          // 检查用户是否选择了"不再显示"
          const dontShowVersion = wx.getStorageSync('dont_show_notice_version');
          if (dontShowVersion === notice.version) {
            console.log('用户选择不再显示此版本通知');
            return;
          }
          
          // 显示自定义弹窗
          this.setData({
            showNotice: true,
            noticeTitle: notice.title || '系统通知',
            noticeContent: notice.content || '',
            showDontShowAgain: notice.showDontShowAgain || false,
            noticeVersion: notice.version,
            noticeShowOnce: notice.showOnce || false
          });
        }
      }
    } catch (err) {
      console.error('检查通知失败:', err);
    }
  },
  
  // 点击"知道了"
  onNoticeConfirm() {
    this.setData({ showNotice: false });
    
    if (this.data.noticeShowOnce) {
      markNoticeShown(this.data.noticeVersion);
    }
  },
  
  // 点击"不再显示"
  onNoticeDontShow() {
    this.setData({ showNotice: false });
    wx.setStorageSync('dont_show_notice_version', this.data.noticeVersion);
    wx.showToast({
      title: '已设置不再显示',
      icon: 'none',
      duration: 2000
    });
  },
  
  // 点击关闭按钮
  onNoticeClose() {
    this.setData({ showNotice: false });
  },
  
  // 从缓存加载横幅，避免闪烁
  loadCachedBanner() {
    const cachedBanner = wx.getStorageSync('cached_banner');
    if (cachedBanner) {
      this.setData({ randomImage: cachedBanner });
    } else {
      // 如果没有缓存，显示本地图片
      this.setData({ randomImage: '/images/frieren004.jpg' });
    }
  },



  onShow() {
    this.updateGreeting();
    this.calculateYearProgress();
    this.checkCurrentCourse();
    this.updateImportantDateCountdown();
    
    // 更新自定义tabBar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().updateTabList();
      this.getTabBar().setData({ selected: 0 });
    }
  },

  calculateYearProgress() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const start = new Date(currentYear, 0, 1);
    const end = new Date(currentYear + 1, 0, 1);
    const progress = ((now - start) / (end - start)) * 100;
    
    const diffTime = Math.abs(end - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    this.setData({ 
      yearProgress: progress.toFixed(1),
      daysLeft: diffDays,
      currentYear: currentYear
    });
  },

  updateGreeting() {
    const hour = new Date().getHours();
    const name = this.data.nickName;
    let greeting = '';
    
    if (hour < 5) {
      greeting = `夜深了，${name}，魔法使也是需要睡眠的。`;
    } else if (hour < 9) {
      greeting = `早上好，${name}，记得吃早餐哦。`;
    } else if (hour < 11) {
      greeting = `上午好，${name}，又是充满希望的一天。`;
    } else if (hour < 14) {
      greeting = `中午好，${name}，吃饭了没？别饿坏了。`;
    } else if (hour < 18) {
      greeting = `下午好，${name}，要不要来杯红茶？`;
    } else if (hour < 22) {
      greeting = `晚上好，${name}，今天过得开心吗？`;
    } else {
      greeting = `夜深了，${name}，早点休息，晚安。`;
    }
    
    this.setData({ greeting });
  },

  onAvatarTap() {
    // 跳转到给用户的一封信页面
    wx.navigateTo({
      url: '/pages/letter/index'
    });
  },

  // 点击Home标题修改昵称
  onTitleTap() {
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新的昵称',
      success: (res) => {
        if (res.confirm && res.content && res.content.trim()) {
          const newName = res.content.trim();
          this.setData({ nickName: newName });
          wx.setStorageSync('nickName', newName);
          this.updateGreeting();
          wx.showToast({ 
            title: '昵称已更新 ✨', 
            icon: 'none' 
          });
        }
      }
    });
  },

  async refreshContent() {
    const randomQuote = ANIME_QUOTES[Math.floor(Math.random() * ANIME_QUOTES.length)];
    
    // 先更新语录
    this.setData({
      quote: randomQuote,
    });
    
    // 尝试从云数据库获取横幅列表
    try {
      const banners = await getBanners();
      if (banners.length > 0) {
        const randomBanner = banners[Math.floor(Math.random() * banners.length)];
        
        // 更新显示
        this.setData({
          randomImage: randomBanner,
        });
        
        // 缓存到本地，下次启动直接用
        wx.setStorageSync('cached_banner', randomBanner);
      }
    } catch (err) {
      console.log('加载云端横幅失败，使用缓存或本地图片:', err);
      // 如果加载失败，保持当前图片（缓存或本地）
    }
  },

  onQuoteTap() {
    wx.showModal({
      title: '语录',
      content: `${this.data.quote.text}\n—— ${this.data.quote.source}`,
      confirmText: '复制',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: `${this.data.quote.text} —— ${this.data.quote.source}`,
            success: () => {
              wx.showToast({ title: '已复制', icon: 'success' });
            }
          });
        }
      }
    });
  },

  // 点击图片：显示大学选择
  onImageTap() {
    // 随机选择一个头像
    const randomAvatar = WISH_AVATARS[Math.floor(Math.random() * WISH_AVATARS.length)];
    this.setData({ 
      showWishModal: true,
      wishAvatar: randomAvatar
    });
  },

  // 选择大学
  selectUniversity(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ universityIndex: [index] });
  },

  closeWishModal() {
    this.setData({ showWishModal: false });
  },

  stopPropagation() {},

  onUniversityChange(e) {
    this.setData({ universityIndex: e.detail.value });
  },

  confirmUniversity() {
    const index = this.data.universityIndex[0];
    const university = this.data.universities[index];
    
    console.log('选择的扩展:', university);
    console.log('索引:', index);
    
    // 先关闭弹窗
    this.setData({ 
      showWishModal: false,
      pendingUniversity: university
    });

    if (university === 'Nothing (切回默认)') {
      // 切回默认，清除选择
      this.setData({
        selectedUniversity: ''
      });
      wx.removeStorageSync('selectedUniversity');
      
      // 立即更新tabBar
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().updateTabList();
        this.getTabBar().setData({ selected: 0 });
      }
      
      wx.showToast({ 
        title: '已切回默认', 
        icon: 'none',
        duration: 1500
      });
    } else if (university === 'Himmel') {
      this.setData({
        showPasswordModal: true,
        passwordTitle: 'Himmel',
        passwordHint: '请切换至中文输入法',
        passwordPlaceholder: '输入通行密语',
        passwordInput: ''
      });
    } else if (university === '河南理工大学') {
      this.setData({
        showPasswordModal: true,
        passwordTitle: '河南理工大学',
        passwordHint: '',
        passwordPlaceholder: '请输入学校英文缩写',
        passwordInput: ''
      });
    } else if (university === '旅时手记') {
      // 显示开发中提示
      this.setData({
        showJourneyDevModal: true
      });
    }
  },

  closePasswordModal() {
    this.setData({ 
      showPasswordModal: false,
      passwordInput: ''
    });
  },

  onPasswordInput(e) {
    this.setData({ 
      passwordInput: e.detail.value,
      passwordError: false  // 输入时清除错误状态
    });
  },

  verifyPassword() {
    const { pendingUniversity, passwordInput } = this.data;
    let isCorrect = false;

    if (pendingUniversity === 'Himmel') {
      isCorrect = passwordInput === '升';
    } else if (pendingUniversity === '河南理工大学') {
      isCorrect = passwordInput.toUpperCase() === 'HPU';
    }

    if (isCorrect) {
      this.setData({
        selectedUniversity: pendingUniversity,
        showPasswordModal: false,
        passwordInput: '',
        passwordError: false
      });
      wx.setStorageSync('selectedUniversity', pendingUniversity);
      
      // 立即更新tabBar
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().updateTabList();
        this.getTabBar().setData({ selected: 0 });
      }
    } else {
      // 显示错误提示，抖动动画，清空输入
      this.setData({ 
        passwordError: true,
        passwordInput: ''
      });
      
      // 300ms 后移除抖动效果
      setTimeout(() => {
        this.setData({ passwordError: false });
      }, 600);
    }
  },

  // 从验证页面返回后的回调
  onShow() {
    this.updateGreeting();
    this.calculateYearProgress();
    this.checkCurrentCourse();
    this.updateImportantDateCountdown();
    
    // 检查是否通过了旅时手记验证
    const journeyVerified = wx.getStorageSync('journey_verified');
    if (journeyVerified) {
      this.setData({
        selectedUniversity: '旅时手记'
      });
      wx.setStorageSync('selectedUniversity', '旅时手记');
      wx.removeStorageSync('journey_verified'); // 清除临时标记
    }
    
    // 更新自定义tabBar
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().updateTabList();
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onShareAppMessage() {
    return {
      title: 'Frieren的万能口袋',
      path: '/pages/home/index',
      imageUrl: '/images/frieren004.jpg' 
    };
  },

  onShareTimeline() {
    return {
      title: 'Frieren的万能口袋',
      imageUrl: '/images/frieren004.jpg' 
    };
  },

  onTimeMagicTap() {
    this.setData({ showCalendarModal: true });
    this.initCalendar();
  },

  closeCalendarModal() {
    this.setData({ showCalendarModal: false });
  },

  // 初始化日历
  initCalendar() {
    const now = new Date();
    this.setData({
      calendarYear: now.getFullYear(),
      calendarMonth: now.getMonth() + 1
    });
    this.generateCalendarDays();
  },

  // 生成日历天数
  generateCalendarDays() {
    const { calendarYear, calendarMonth, importantDates } = this.data;
    const firstDay = new Date(calendarYear, calendarMonth - 1, 1);
    const lastDay = new Date(calendarYear, calendarMonth, 0);
    const today = new Date();
    
    const days = [];
    
    // 填充月初空白
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push({ isEmpty: true, day: '' });
    }
    
    // 填充日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = `${calendarYear}-${String(calendarMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isToday = today.getFullYear() === calendarYear && 
                      today.getMonth() + 1 === calendarMonth && 
                      today.getDate() === i;
      const hasEvent = importantDates.some(d => d.date === dateStr);
      
      days.push({
        day: i,
        date: dateStr,
        isToday,
        hasEvent,
        isEmpty: false
      });
    }
    
    this.setData({ calendarDays: days });
  },

  // 上个月
  prevMonth() {
    let { calendarYear, calendarMonth } = this.data;
    calendarMonth--;
    if (calendarMonth < 1) {
      calendarMonth = 12;
      calendarYear--;
    }
    this.setData({ calendarYear, calendarMonth });
    this.generateCalendarDays();
  },

  // 下个月
  nextMonth() {
    let { calendarYear, calendarMonth } = this.data;
    calendarMonth++;
    if (calendarMonth > 12) {
      calendarMonth = 1;
      calendarYear++;
    }
    this.setData({ calendarYear, calendarMonth });
    this.generateCalendarDays();
  },

  // 点击日期
  onDayTap(e) {
    const { date, day } = e.currentTarget.dataset;
    if (!day) return;
  },

  // 添加重要日期 - 打开弹窗
  addImportantDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    this.setData({
      showAddDateModal: true,
      newEventName: '',
      newEventDate: `${year}-${month}-${day}`
    });
  },

  closeAddDateModal() {
    this.setData({ showAddDateModal: false });
  },

  onEventNameInput(e) {
    this.setData({ newEventName: e.detail.value });
  },

  onDatePickerChange(e) {
    this.setData({ newEventDate: e.detail.value });
  },

  confirmAddDate() {
    const { newEventName, newEventDate, importantDates } = this.data;
    
    if (!newEventName.trim()) {
      wx.showToast({ title: '请输入事件名称', icon: 'none' });
      return;
    }
    
    if (!newEventDate) {
      wx.showToast({ title: '请选择日期', icon: 'none' });
      return;
    }
    
    const newDate = {
      id: Date.now(),
      name: newEventName.trim(),
      date: newEventDate,
      countdown: this.calculateCountdown(newEventDate)
    };
    
    importantDates.push(newDate);
    this.setData({ 
      importantDates,
      showAddDateModal: false
    });
    wx.setStorageSync('importantDates', importantDates);
    this.generateCalendarDays();
    this.updateImportantDateCountdown();
    wx.showToast({ title: '添加成功', icon: 'success' });
  },

  // 计算倒计时
  calculateCountdown(dateStr) {
    const target = new Date(dateStr);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return '就是今天！';
    if (days > 0) return `还有${days}天`;
    return `已过${Math.abs(days)}天`;
  },

  // 删除重要日期
  deleteImportantDate(e) {
    const id = e.currentTarget.dataset.id;
    const { importantDates } = this.data;
    const newDates = importantDates.filter(d => d.id !== id);
    
    this.setData({ importantDates: newDates });
    wx.setStorageSync('importantDates', newDates);
    this.generateCalendarDays();
    this.updateImportantDateCountdown();
    wx.showToast({ title: '已删除', icon: 'none' });
  },

  // 更新重要日期倒计时显示
  updateImportantDateCountdown() {
    const { importantDates } = this.data;
    if (importantDates.length === 0) {
      this.setData({ importantDateCountdown: '' });
      return;
    }
    
    // 更新每个日期的倒计时
    const updatedDates = importantDates.map(d => ({
      ...d,
      countdown: this.calculateCountdown(d.date)
    }));
    
    // 找到最近的未过期日期
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const futureDates = updatedDates.filter(d => {
      const target = new Date(d.date);
      target.setHours(0, 0, 0, 0);
      return target >= now;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (futureDates.length > 0) {
      const nearest = futureDates[0];
      const target = new Date(nearest.date);
      target.setHours(0, 0, 0, 0);
      const days = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      
      this.setData({ 
        importantDates: updatedDates,
        importantDateCountdown: days === 0 ? '今天' : `${days}天`,
        upcomingEvent: {
          name: nearest.name,
          date: nearest.date,
          days: days,
          totalCount: futureDates.length
        }
      });
    } else {
      this.setData({ 
        importantDates: updatedDates,
        importantDateCountdown: '',
        upcomingEvent: null
      });
    }
  },

  onMimicTap() {
    const schedule = wx.getStorageSync('courseSchedule');
    
    // 丰富的抽签结果（无emoji版本）
    const fortunes = [
      { result: '大吉', desc: '今天运气爆棚！好事连连~' },
      { result: '中吉', desc: '运势不错，继续保持！' },
      { result: '小吉', desc: '平稳安心的一天~' },
      { result: '末吉', desc: '虽然平淡，但也是幸运~' },
      { result: '吉', desc: '今日宜学习，宜摸鱼~' },
      { result: '半吉', desc: '好坏参半，谨慎行事~' },
      { result: '小凶', desc: '注意休息，别太累了~' },
      { result: '凶', desc: '今天适合躺平~' },
      { result: '大凶', desc: '建议宅家，多喝热水~' },
      { result: '被宝箱怪咬了一口', desc: 'HP -1，但获得了神秘力量！' }
    ];
    
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    
    this.setData({ mimicStatus: randomFortune.result });

    // 使用自定义弹窗
    let message = randomFortune.desc;
    if (!schedule || schedule.length === 0) {
      if (randomFortune.result === '被宝箱怪咬了一口') {
        message = `${randomFortune.desc}\n\n提示：去Tools页面上传课表，宝箱怪会告诉你下节课是什么哦~`;
      }
    } else {
      // 有课表时附加课程信息
      const currentCourse = this.findCurrentCourse(schedule);
      if (currentCourse) {
        message = `${randomFortune.desc}\n\n当前课程：${currentCourse.name}\n地点：${currentCourse.location || '未知'}`;
      }
    }
    
    this.setData({
      showMimicModal: true,
      mimicResult: randomFortune.result,
      mimicMessage: message
    });
  },

  closeMimicModal() {
    this.setData({ showMimicModal: false });
  },

  checkCurrentCourse() {
    const schedule = wx.getStorageSync('courseSchedule');
    if (schedule && schedule.length > 0) {
      const currentCourse = this.findCurrentCourse(schedule);
      if (currentCourse) {
        this.setData({ 
          mimicStatus: currentCourse.name,
          currentCourse: currentCourse
        });
      } else {
        this.setData({ 
          mimicStatus: '当前无课',
          currentCourse: null
        });
      }
    }
  },

  findCurrentCourse(schedule) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const today = weekDays[dayOfWeek];
    
    for (let course of schedule) {
      if (course.day === today) {
        const times = course.time.split('-');
        if (times.length === 2) {
          const startParts = times[0].split(':');
          const endParts = times[1].split(':');
          const startTime = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
          const endTime = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
          
          if (currentTime >= startTime && currentTime <= endTime) {
            return course;
          }
        }
      }
    }
    return null;
  },

  closeJourneyDevModal() {
    this.setData({ showJourneyDevModal: false });
  },

  showCurrentCourse() {
    const { currentCourse } = this.data;
    
    if (currentCourse) {
      wx.showModal({
        title: '📚 当前课程',
        content: `课程：${currentCourse.name}\n教室：${currentCourse.room || '未知'}\n时间：${currentCourse.time}`,
        showCancel: false,
        confirmText: '知道了'
      });
    } else {
      wx.showModal({
        title: '🎉 当前无课',
        content: '现在没有课程安排，好好休息吧！',
        showCancel: false,
        confirmText: '太棒了'
      });
    }
  },

  // 显示抽签结果和课程信息
  showFortuneWithCourse(fortune) {
    const { currentCourse } = this.data;
    let content = fortune.desc;
    
    if (currentCourse) {
      content += `\n\n━━━━━━━━━━━━━━\n📚 当前课程\n课程：${currentCourse.name}\n教室：${currentCourse.room || '未知'}\n时间：${currentCourse.time}`;
    } else {
      content += '\n\n━━━━━━━━━━━━━━\n🎉 当前无课，好好休息吧！';
    }
    
    wx.showModal({
      title: `${fortune.emoji} ${fortune.result}`,
      content: content,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
