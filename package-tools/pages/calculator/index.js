const { compute, formatNumber } = require('../../../utils/calc');

// 彩蛋配置
const EASTER_EGGS = {
  // 妈妈生日
  '1105': '妈妈生日快乐 🎂',
  '1206': '妈妈生日快乐 🎂',
  '19791206': '妈妈生日快乐 🎂',
  // 爸爸生日
  '1006': '爸爸生日快乐 🎂',
  '1107': '爸爸生日快乐 🎂',
  '19781107': '爸爸生日快乐 🎂',
};

Page({
  data: {
    display: '0',
    accumulator: null,
    pendingOperator: '',
    overwrite: true,
  },

  onClear() {
    this.setData({
      display: '0',
      accumulator: null,
      pendingOperator: '',
      overwrite: true,
    });
  },

  onBackspace() {
    const { display, overwrite } = this.data;
    if (overwrite) return;

    if (display.length <= 1) {
      this.setData({ display: '0', overwrite: true });
      return;
    }

    const next = display.slice(0, -1);
    this.setData({ display: next });
  },

  onDigit(e) {
    const digit = String(e.currentTarget.dataset.digit);
    const { display, overwrite } = this.data;

    if (overwrite) {
      this.setData({ display: digit, overwrite: false });
      return;
    }

    if (display === '0') {
      this.setData({ display: digit });
      return;
    }

    this.setData({ display: display + digit });
  },

  onDot() {
    const { display, overwrite } = this.data;

    if (overwrite) {
      this.setData({ display: '0.', overwrite: false });
      return;
    }

    if (display.includes('.')) return;
    this.setData({ display: display + '.' });
  },

  onOperator(e) {
    const op = e.currentTarget.dataset.op;
    const { display, accumulator, pendingOperator, overwrite } = this.data;
    const current = Number(display);

    if (accumulator === null) {
      this.setData({
        accumulator: current,
        pendingOperator: op,
        overwrite: true,
      });
      return;
    }

    // If user taps operator repeatedly, just change the pending operator.
    if (overwrite) {
      this.setData({ pendingOperator: op });
      return;
    }

    const nextAcc = compute(accumulator, pendingOperator, current);
    this.setData({
      accumulator: nextAcc,
      pendingOperator: op,
      display: formatNumber(nextAcc),
      overwrite: true,
    });
  },

  onEquals() {
    const { display, accumulator, pendingOperator, overwrite } = this.data;
    
    // 检查彩蛋（无需运算符也能触发）
    const easterEgg = this.checkEasterEgg(display);
    if (easterEgg) {
      this.showEasterEggModal(easterEgg);
      return;
    }
    
    if (!pendingOperator || accumulator === null || overwrite) return;

    const current = Number(display);
    const result = compute(accumulator, pendingOperator, current);

    this.setData({
      display: formatNumber(result),
      accumulator: null,
      pendingOperator: '',
      overwrite: true,
    });
  },

  checkEasterEgg(input) {
    // 移除小数点和负号
    const cleanInput = input.replace(/[.\-]/g, '');
    
    // 检查预定义彩蛋
    if (EASTER_EGGS[cleanInput]) {
      return EASTER_EGGS[cleanInput];
    }
    
    // 检查当前年份
    const currentYear = new Date().getFullYear().toString();
    if (cleanInput === currentYear) {
      return `希望你${currentYear}年平平安安开开心心 ✨`;
    }
    
    // 检查当天日期 (MMDD 格式)
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = month + day;
    const todayAlt = String(now.getMonth() + 1) + day; // 如 104 代替 0104
    
    if (cleanInput === today || cleanInput === todayAlt) {
      return '生命的终结是你的未来，也是我的过去\n——《夏日幽灵》';
    }
    
    return null;
  },

  showEasterEggModal(message) {
    wx.showModal({
      title: '🎉 彩蛋',
      content: message,
      showCancel: false,
      confirmText: '收到'
    });
  }
});
