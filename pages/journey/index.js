// 旅时手记 - 主页面
Page({
  data: {
    activeTab: 0,
    tabs: ['情感刻印', '见闻拾遗', '共感之问'],
    
    emotions: [],
    showAddEmotion: false,
    newEmotionTag: 0,
    emotionTags: ['瞭望', '回响', '静默'],
    newEmotionMoment: '',
    newEmotionThought: '',
    
    discoveries: [
      {
        id: 1,
        type: 'magic',
        title: '杀人魔法',
        subtitle: '极致专注的体现',
        content: '最初只为突破极限，后成为守护的证明。\n\n这个魔法象征着芙莉莲对魔法的执着追求，也代表了她从孤独的魔法使到愿意守护他人的转变。',
        icon: '✨'
      },
      {
        id: 2,
        type: 'character',
        title: '辛美尔',
        subtitle: '「模范」并非目的，「真实」才是遗产',
        content: '他塑造传说，不是为了名垂青史，而是为了在漫长的时间中，给芙莉莲留下可以追寻的记忆和温暖。\n\n每一个雕像的姿势，每一个流传的故事，都是他留给芙莉莲的"人类足迹"。',
        icon: '⚔️'
      },
      {
        id: 3,
        type: 'magic',
        title: '时间魔法',
        content: '作品中最珍贵的不是能够操控时间的魔法，而是对时间流逝的感知。\n\n芙莉莲用千年的生命，学会了珍惜每一个短暂的瞬间。',
        icon: '⏳'
      }
    ],
    
    currentQuestion: {
      id: 1,
      question: '对你而言，什么是"漫长生命里短暂的幸福"？',
      responses: []
    },
    showAddResponse: false,
    newResponse: ''
  },

  onLoad() {
    const savedEmotions = wx.getStorageSync('journey_emotions') || [];
    this.setData({ emotions: savedEmotions });
    
    const savedResponses = wx.getStorageSync('journey_responses') || [];
    this.setData({
      'currentQuestion.responses': savedResponses
    });
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
  },

  openAddEmotion() {
    this.setData({ 
      showAddEmotion: true,
      newEmotionTag: 0,
      newEmotionMoment: '',
      newEmotionThought: ''
    });
  },

  closeAddEmotion() {
    this.setData({ showAddEmotion: false });
  },

  selectEmotionTag(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ newEmotionTag: index });
  },

  onMomentInput(e) {
    this.setData({ newEmotionMoment: e.detail.value });
  },

  onThoughtInput(e) {
    this.setData({ newEmotionThought: e.detail.value });
  },

  saveEmotion() {
    const { newEmotionTag, newEmotionMoment, newEmotionThought, emotions, emotionTags } = this.data;
    
    if (!newEmotionMoment.trim()) {
      wx.showToast({ title: '请输入触动的瞬间', icon: 'none' });
      return;
    }
    
    if (!newEmotionThought.trim()) {
      wx.showToast({ title: '请写下你的感想', icon: 'none' });
      return;
    }
    
    const newEmotion = {
      id: Date.now(),
      tag: emotionTags[newEmotionTag],
      tagIndex: newEmotionTag,
      moment: newEmotionMoment.trim(),
      thought: newEmotionThought.trim(),
      date: new Date().toLocaleDateString('zh-CN')
    };
    
    emotions.unshift(newEmotion);
    this.setData({ 
      emotions,
      showAddEmotion: false
    });
    
    wx.setStorageSync('journey_emotions', emotions);
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  deleteEmotion(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复',
      success: (res) => {
        if (res.confirm) {
          const emotions = this.data.emotions.filter(item => item.id !== id);
          this.setData({ emotions });
          wx.setStorageSync('journey_emotions', emotions);
          wx.showToast({ title: '已删除', icon: 'none' });
        }
      }
    });
  },

  viewDiscovery(e) {
    const item = e.currentTarget.dataset.item;
    
    wx.showModal({
      title: item.title,
      content: item.content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  openAddResponse() {
    this.setData({ 
      showAddResponse: true,
      newResponse: ''
    });
  },

  closeAddResponse() {
    this.setData({ showAddResponse: false });
  },

  onResponseInput(e) {
    this.setData({ newResponse: e.detail.value });
  },

  saveResponse() {
    const { newResponse, currentQuestion } = this.data;
    
    if (!newResponse.trim()) {
      wx.showToast({ title: '请输入你的回应', icon: 'none' });
      return;
    }
    
    const response = {
      id: Date.now(),
      content: newResponse.trim(),
      date: new Date().toLocaleDateString('zh-CN')
    };
    
    currentQuestion.responses.unshift(response);
    this.setData({ 
      currentQuestion,
      showAddResponse: false
    });
    
    wx.setStorageSync('journey_responses', currentQuestion.responses);
    wx.showToast({ title: '已保存', icon: 'success' });
  },

  deleteResponse(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复',
      success: (res) => {
        if (res.confirm) {
          const responses = this.data.currentQuestion.responses.filter(item => item.id !== id);
          this.setData({ 'currentQuestion.responses': responses });
          wx.setStorageSync('journey_responses', responses);
          wx.showToast({ title: '已删除', icon: 'none' });
        }
      }
    });
  },

  stopPropagation() {}
});
