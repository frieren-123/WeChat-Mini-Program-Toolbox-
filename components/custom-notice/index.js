Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: ''
    },
    content: {
      type: String,
      value: ''
    },
    showDontShowAgain: {
      type: Boolean,
      value: false
    }
  },

  data: {
    contentBlocks: []
  },

  observers: {
    'content': function(newContent) {
      // 将内容按段落分割成色块
      if (newContent) {
        const lines = newContent.split('\n').filter(line => line.trim());
        const blocks = [];
        
        // 每2行组成一个色块
        for (let i = 0; i < lines.length; i += 2) {
          const blockLines = [lines[i]];
          if (i + 1 < lines.length) {
            blockLines.push(lines[i + 1]);
          }
          
          // 根据索引分配颜色
          const colorIndex = Math.floor(i / 2) % 3;
          const colors = ['primary', 'secondary', 'tertiary'];
          
          blocks.push({
            lines: blockLines,
            color: colors[colorIndex]
          });
        }
        
        this.setData({ contentBlocks: blocks });
      }
    }
  },

  methods: {
    // 点击遮罩层
    onMaskTap() {
      // 不关闭，防止误触
    },

    // 阻止冒泡
    stopPropagation() {},

    // 关闭弹窗
    onClose() {
      this.triggerEvent('close');
    },

    // 点击"知道了"
    onConfirm() {
      this.triggerEvent('confirm');
    },

    // 点击"不再显示"
    onDontShow() {
      this.triggerEvent('dontshow');
    }
  }
});
