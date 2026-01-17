// 旅时手记 - 验证页面
Page({
  data: {
    currentQuestion: 0,
    selectedAnswer: -1,
    score: 0,
    showResult: false,
    questions: [
      {
        question: '芙莉莲在辛美尔去世后才开始"理解人类"，作品中如何表现这种"后知后觉"的哀伤？',
        options: [
          '通过大量内心独白直接倾诉',
          '通过在漫长旅程中，无数细微的、延迟的情感反应来展现',
          '通过其他角色不断提醒她',
          '通过梦境和幻象来呈现'
        ],
        correct: 1
      },
      {
        question: '"灵魂安眠之地"的篇章，为什么被认为是对"葬送"主题的一次升华？',
        options: [
          '因为那里有最强的魔法',
          '因为它将"葬送"从物理消灭，升华为对逝者记忆的温柔保管与情感传承',
          '因为芙莉莲在那里哭了',
          '因为那是旅程的终点'
        ],
        correct: 1
      },
      {
        question: '休塔尔克在"师祖"面前坚持自己是"战士"而非"僧侣"，这主要体现了他怎样的成长？',
        options: [
          '他变得骄傲自大了',
          '他从盲目追随师父的"模板"，走向了对自我价值的认同与坚守',
          '他开始反抗费伦',
          '他想学习更酷的技能'
        ],
        correct: 1
      },
      {
        question: '辛美尔"塑造传说"的行为（如雕像摆姿势），其根本目的是什么？',
        options: [
          '为了自己名垂青史',
          '为了给芙莉莲留下清晰、美好且能持续引导她的"人类足迹"与记忆坐标',
          '为了给后世冒险者提供攻略',
          '只是一时兴起的恶作剧'
        ],
        correct: 1
      },
      {
        question: '动画中常常用"静止帧"和舒缓的节奏来表现芙莉莲的旅程，这种风格主要营造了怎样的观看体验？',
        options: [
          '紧张刺激，让人屏息',
          '沉静、留白，让观众有时间与角色一同"感受"和"回味"',
          '无聊乏味，容易走神',
          '信息密集，需要快速思考'
        ],
        correct: 1
      },
      {
        question: '作品在描绘"千年时光"时，最常使用以下哪种对比手法来让观众直观感受？',
        options: [
          '将一瞬间的感动（如一个承诺）置于漫长的生命尺度中反复回响',
          '精确地罗列历史年表',
          '让角色不断口头强调"我很老"',
          '展示地貌的剧烈变迁'
        ],
        correct: 0
      }
    ]
  },

  onLoad() {
    const questions = this.data.questions;
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    this.setData({ questions });
  },

  selectAnswer(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ selectedAnswer: index });
  },

  nextQuestion() {
    const { currentQuestion, selectedAnswer, questions, score } = this.data;
    
    if (selectedAnswer === -1) {
      wx.showToast({
        title: '请选择一个答案',
        icon: 'none'
      });
      return;
    }

    const isCorrect = selectedAnswer === questions[currentQuestion].correct;
    const newScore = isCorrect ? score + 1 : score;

    if (currentQuestion < questions.length - 1) {
      this.setData({
        currentQuestion: currentQuestion + 1,
        selectedAnswer: -1,
        score: newScore
      });
    } else {
      this.setData({
        score: newScore,
        showResult: true
      });
    }
  },

  retryQuiz() {
    const questions = this.data.questions;
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    
    this.setData({
      currentQuestion: 0,
      selectedAnswer: -1,
      score: 0,
      showResult: false,
      questions
    });
  },

  enterJourney() {
    const { score, questions } = this.data;
    
    if (score >= 4) {
      wx.setStorageSync('journey_verified', true);
      wx.showToast({
        title: '欢迎来到旅时手记',
        icon: 'success',
        duration: 2000
      });
      
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    } else {
      wx.showModal({
        title: '还差一点点',
        content: `你答对了 ${score}/${questions.length} 题。\n\n旅时手记是为真正理解并热爱这部作品的同好准备的空间。\n\n建议重新观看作品，感受其中的情感与哲学，再来尝试吧。`,
        confirmText: '重新作答',
        cancelText: '返回',
        success: (res) => {
          if (res.confirm) {
            this.retryQuiz();
          } else {
            wx.navigateBack();
          }
        }
      });
    }
  },

  goBack() {
    wx.navigateBack();
  }
});
