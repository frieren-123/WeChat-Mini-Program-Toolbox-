const app = getApp();

// 本地台词库（带出处）
const ANIME_QUOTES = [
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

// 本地横屏壁纸库 (请确保 images 目录下有这些图片)
const BANNER_IMAGES = [
  // '/images/1001.jpg', // 太大已删除
  '/images/1002.jpg',
  // '/images/1003.jpg', // 太大已删除
  '/images/1004.jpg',
  '/images/1005.jpg',
  // '/images/1006.jpg' // 太大已删除
];

// 彩蛋弹窗图片库
const EGG_IMAGES = [
  // '/images/frieren001.jpg', // 暂时暂停使用
  // '/images/frieren002.jpg', // 暂时暂停使用
  // '/images/frieren003.jpg', // 太大已删除
  '/images/frieren004.jpg',
  '/images/frieren005.jpg',
  // '/images/frieren006.jpg' // 太大已删除
];

Page({
  data: {
    nickName: '唯', // 用户昵称，可修改
    greeting: '',
    quote: {}, 
    randomImage: '',
    eggImage: '', // 弹窗显示的图片
    showWishModal: false,
    yearProgress: 0,
    mimicStatus: '点击开箱',
  },

  onLoad() {
    const savedName = wx.getStorageSync('nickName');
    if (savedName) {
      this.setData({ nickName: savedName });
    }
    this.updateGreeting();
    this.calculateYearProgress();
    this.refreshContent();
  },

  onShow() {
    this.updateGreeting(); // 每次显示页面都更新一下问候语
    this.calculateYearProgress();
  },

  calculateYearProgress() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const start = new Date(currentYear, 0, 1);
    const end = new Date(currentYear + 1, 0, 1);
    const progress = ((now - start) / (end - start)) * 100;
    
    // 计算剩余天数
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

  // 点击头像修改昵称
  onAvatarTap() {
    wx.showModal({
      title: '设置昵称',
      content: this.data.nickName,
      editable: true,
      placeholderText: '请输入新的昵称',
      success: (res) => {
        if (res.confirm) {
          // 如果用户输入了内容，则更新；如果清空或未输入，保持原样
          const newName = res.content.trim();
          if (newName) {
            this.setData({ nickName: newName });
            wx.setStorageSync('nickName', newName); // 本地存储
            this.updateGreeting(); // 立即刷新问候语
            wx.showToast({ title: '已更新', icon: 'success' });
          }
        }
      }
    });
  },

  refreshContent() {
    // 随机文案
    const randomQuote = ANIME_QUOTES[Math.floor(Math.random() * ANIME_QUOTES.length)];
    
    // 随机本地壁纸
    const randomBanner = BANNER_IMAGES[Math.floor(Math.random() * BANNER_IMAGES.length)];

    // 随机彩蛋图 (每次进入小程序刷新一次)
    const randomEgg = EGG_IMAGES[Math.floor(Math.random() * EGG_IMAGES.length)];

    this.setData({
      quote: randomQuote,
      randomImage: randomBanner,
      eggImage: randomEgg
    });
  },

  // 点击文案：复制或取消
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

  // 点击图片：显示许愿彩蛋
  onImageTap() {
    this.setData({ 
      showWishModal: true
    });
  },

  // 关闭许愿弹窗
  closeWishModal() {
    this.setData({ showWishModal: false });
  },

  // 许愿
  onMakeWish() {
    wx.showToast({
      title: '愿望已许下 ✨',
      icon: 'none',
      duration: 2000
    });
    this.setData({ showWishModal: false });
  },

  // 时间魔法
  onTimeMagicTap() {
    wx.showToast({
      title: '时间流逝中...',
      icon: 'none'
    });
  },

  // 宝箱怪 (每日运势)
  onMimicTap() {
    const fortunes = ['大吉', '中吉', '小吉', '末吉', '被宝箱怪咬了一口'];
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    
    this.setData({ mimicStatus: randomFortune });
    
    if (randomFortune === '被宝箱怪咬了一口') {
      wx.showModal({
        title: '哎呀！',
        content: '你打开了一个宝箱怪，HP -1',
        showCancel: false,
        confirmText: '复活'
      });
    } else {
      wx.showToast({
        title: `运势：${randomFortune}`,
        icon: 'none'
      });
    }
  }
});
