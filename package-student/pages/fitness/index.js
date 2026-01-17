Page({
  data: {
    gender: 'male',
    grades: ['大一', '大二', '大三', '大四'],
    gradeIndex: 0,
    formData: {
      height: '',
      weight: '',
      lung: '',
      run50: '',
      jump: '',
      reach: '',
      runLong: '',
      pull: ''
    },
    totalScore: null,
    bmi: 0,
    bmiStatus: ''
  },

  setGender(e) {
    this.setData({ gender: e.currentTarget.dataset.val });
  },

  onGradeChange(e) {
    this.setData({ gradeIndex: e.detail.value });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    const val = e.detail.value;
    this.setData({
      [`formData.${field}`]: val
    });
  },

  calculate() {
    const { height, weight } = this.data.formData;
    
    if (!height || !weight) {
      wx.showToast({ title: '请填写身高体重', icon: 'none' });
      return;
    }

    // Simple BMI Calc
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    const bmi = (w / (h * h)).toFixed(1);
    
    let status = '正常';
    if (bmi < 18.5) status = '低体重';
    else if (bmi >= 24 && bmi < 28) status = '超重';
    else if (bmi >= 28) status = '肥胖';

    // Mock Score Calculation (Real logic requires huge tables)
    // Just for demo purposes, generate a random realistic score
    const mockScore = Math.floor(Math.random() * 30) + 60; // 60-90

    this.setData({
      totalScore: mockScore,
      bmi: bmi,
      bmiStatus: status
    });

    wx.pageScrollTo({
      scrollTop: 1000,
      duration: 300
    });
  },

  saveRecord() {
    const { totalScore, bmi, bmiStatus, gradeIndex, grades } = this.data;
    const record = {
      date: new Date().toLocaleDateString(),
      score: totalScore,
      bmi,
      bmiStatus,
      grade: grades[gradeIndex],
      timestamp: Date.now()
    };

    const history = wx.getStorageSync('fitness_history') || [];
    history.unshift(record); // Add to top
    wx.setStorageSync('fitness_history', history);

    wx.showToast({ title: '已保存', icon: 'success' });
  },

  viewHistory() {
    wx.navigateTo({
      url: '/package-student/pages/fitness/history/index'
    });
  }
});