Page({
  data: {
    currentMode: 'draw', // draw, sort, group
    modeName: '抓阄',
    inputText: '',
    drawCount: 1,
    groupCount: 2,
    showResult: false,
    resultList: []
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode;
    let name = '抓阄';
    if (mode === 'sort') name = '排序';
    if (mode === 'group') name = '分组';
    
    this.setData({
      currentMode: mode,
      modeName: name,
      showResult: false
    });
  },

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  clearInput() {
    this.setData({ inputText: '' });
  },

  pasteInput() {
    const that = this;
    wx.getClipboardData({
      success(res) {
        that.setData({
          inputText: res.data
        });
      }
    });
  },

  showTemplates() {
    const templates = [
      { name: '值日分工', content: '扫地\n拖地\n倒垃圾\n擦窗户\n擦桌子', mode: 'group' },
      { name: '演讲顺序', content: '第一组\n第二组\n第三组\n第四组\n第五组', mode: 'sort' },
      { name: '午餐选择', content: '中餐\n西餐\n面条\n盖饭\n沙拉\n汉堡', mode: 'draw' },
      { name: '聚会游戏', content: '真心话大冒险\n狼人杀\nUno\n桌游\nKTV', mode: 'draw' },
      { name: '团队角色', content: '组长\n记录员\n计时员\n汇报人\n后勤', mode: 'group' },
      { name: '一周安排', content: '周一\n周二\n周三\n周四\n周五\n周六\n周日', mode: 'sort' }
    ];
    
    wx.showActionSheet({
      itemList: templates.map(t => t.name),
      success: (res) => {
        const selected = templates[res.tapIndex];
        let modeName = '抓阄';
        if (selected.mode === 'sort') modeName = '排序';
        if (selected.mode === 'group') modeName = '分组';

        // Force update input first to clear potential rendering issues
        this.setData({ inputText: ' ' }, () => {
          setTimeout(() => {
            this.setData({
              inputText: selected.content,
              currentMode: selected.mode,
              modeName: modeName
            });
          }, 100);
        });
      }
    });
  },

  onDrawCountInput(e) {
    let val = parseInt(e.detail.value);
    if (isNaN(val) || val < 1) val = 1;
    this.setData({ drawCount: val });
  },

  onGroupCountInput(e) {
    let val = parseInt(e.detail.value);
    if (isNaN(val) || val < 2) val = 2;
    this.setData({ groupCount: val });
  },

  startLottery() {
    const text = this.data.inputText.trim();
    if (!text) {
      wx.showToast({ title: '请输入名单', icon: 'none' });
      return;
    }

    // Split by newline or comma
    let list = text.split(/[\n,，]/).map(s => s.trim()).filter(s => s);
    
    if (list.length === 0) {
      wx.showToast({ title: '名单为空', icon: 'none' });
      return;
    }

    // Shuffle function
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    list = shuffle(list);

    let result = [];
    const { currentMode, drawCount, groupCount } = this.data;

    if (currentMode === 'draw') {
      const count = Math.min(drawCount, list.length);
      result = list.slice(0, count);
    } else if (currentMode === 'sort') {
      result = list;
    } else if (currentMode === 'group') {
      const groups = Array.from({ length: groupCount }, () => []);
      list.forEach((item, index) => {
        groups[index % groupCount].push(item);
      });
      result = groups;
    }

    this.setData({
      resultList: result,
      showResult: true
    });
  },

  closeResult() {
    this.setData({ showResult: false });
  },

  stopProp() {},

  copyResult() {
    let text = '';
    const { currentMode, resultList } = this.data;

    if (currentMode === 'draw') {
      text = '【中签名单】\n' + resultList.join('\n');
    } else if (currentMode === 'sort') {
      text = '【随机排序】\n' + resultList.map((item, i) => `${i + 1}. ${item}`).join('\n');
    } else if (currentMode === 'group') {
      text = '【分组结果】\n' + resultList.map((group, i) => `第${i + 1}组：${group.join(', ')}`).join('\n');
    }

    wx.setClipboardData({
      data: text,
      success() {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  }
});