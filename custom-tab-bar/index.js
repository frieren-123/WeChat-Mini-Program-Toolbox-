Component({
  data: {
    selected: 0,
    list: []
  },

  lifetimes: {
    attached() {
      this.updateTabList();
    }
  },

  methods: {
    updateTabList() {
      const selectedUniversity = wx.getStorageSync('selectedUniversity');
      let list = [
        {
          pagePath: '/pages/home/index',
          text: 'Home',
          icon: 'home'
        }
      ];

      // 根据选择的大学添加对应页面
      if (selectedUniversity === '河南理工大学') {
        list.push({
          pagePath: '/pages/university/index',
          text: 'University',
          icon: 'school'
        });
      } else if (selectedUniversity === 'Himmel') {
        list.push({
          pagePath: '/pages/frieren/index',
          text: 'Frieren',
          icon: 'star'
        });
      } else if (selectedUniversity === '旅时手记') {
        list.push({
          pagePath: '/pages/journey/index',
          text: 'Journey',
          icon: 'book'
        });
      }

      list.push(
        {
          pagePath: '/pages/tools/index',
          text: 'Tools',
          icon: 'grid'
        },
        {
          pagePath: '/pages/about/index',
          text: 'About',
          icon: 'info'
        }
      );

      this.setData({ list });
    },

    switchTab(e) {
      const { path, index } = e.currentTarget.dataset;
      wx.switchTab({
        url: path,
        success: () => {
          this.setData({ selected: index });
        }
      });
    }
  }
});