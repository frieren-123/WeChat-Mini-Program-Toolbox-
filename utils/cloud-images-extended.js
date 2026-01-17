/**
 * 扩展版云存储图片配置文件
 * 支持更多图片分类和动态加载
 */

// 云环境ID
const CLOUD_ENV_ID = 'cloud://frieren-cloud-0gd6n3lr386ef01d.6672-frieren-cloud-0gd6n3lr386ef01d';

/**
 * 图片配置
 */
const cloudImages = {
  // ==================== 横屏壁纸 ====================
  banners: [
    `${CLOUD_ENV_ID}/images/banners/1002.jpg`,
    `${CLOUD_ENV_ID}/images/banners/1004.jpg`,
    `${CLOUD_ENV_ID}/images/banners/1005.jpg`,
  ],

  // ==================== 卡片图片 ====================
  cards: {
    card001: `${CLOUD_ENV_ID}/images/cards/001.jpg`,
    card005: `${CLOUD_ENV_ID}/images/cards/005.jpg`,
    card006: `${CLOUD_ENV_ID}/images/cards/006.jpg`,
    card007: `${CLOUD_ENV_ID}/images/cards/007.jpg`,
    card012: `${CLOUD_ENV_ID}/images/cards/012.jpg`,
    card013: `${CLOUD_ENV_ID}/images/cards/013.jpg`,
  },

  // ==================== 校园风景 ====================
  scenery: {
    // 南校区
    south: {
      teaching: [], // 教学楼照片
      library: [],  // 图书馆照片
      canteen: [],  // 食堂照片
      dormitory: [], // 宿舍照片
      playground: [], // 操场照片
      garden: [],   // 花园照片
      others: [     // 其他风景
        `${CLOUD_ENV_ID}/images/scenery/0001.jpg`,
        `${CLOUD_ENV_ID}/images/scenery/0002.jpg`,
        `${CLOUD_ENV_ID}/images/scenery/0003.jpg`,
        `${CLOUD_ENV_ID}/images/scenery/0004.jpg`,
        `${CLOUD_ENV_ID}/images/scenery/0005.jpg`,
        `${CLOUD_ENV_ID}/images/scenery/0006.jpg`,
        `${CLOUD_ENV_ID}/images/scenery/0007.jpg`,
      ]
    },
    // 北校区
    north: {
      teaching: [],
      library: [],
      canteen: [],
      dormitory: [],
      playground: [],
      garden: [],
      others: []
    }
  },

  // ==================== 校园生灵 ====================
  creatures: {
    cats: [
      `${CLOUD_ENV_ID}/images/creatures/0001.jpg`,
      // 可以继续添加更多猫咪照片
    ],
    dogs: [
      // 狗狗照片
    ],
    birds: [
      // 小鸟照片
    ],
    others: [
      // 其他动物照片
    ]
  },

  // ==================== 旅行照片 ====================
  travel: {
    beijing: [],   // 北京
    shanghai: [],  // 上海
    hangzhou: [],  // 杭州
    others: []     // 其他城市
  },

  // ==================== 动漫截图 ====================
  anime: {
    frieren: [],   // 葬送的芙莉莲
    yourlie: [],   // 四月是你的谎言
    others: []     // 其他动漫
  },

  // ==================== 黄昏照片 ====================
  sunset: [
    // 黄昏照片
  ],

  // ==================== 本地小图标 ====================
  local: {
    frieren004: '/images/frieren004.jpg',
    frieren005: '/images/frieren005.jpg',
    icon002: '/images/002.jpg',
    icon003: '/images/003.jpg',
    icon004: '/images/004.jpg',
    icon008: '/images/008.jpg',
    icon009: '/images/009.jpg',
    icon010: '/images/010.jpg',
    icon011: '/images/011.jpg',
  }
};

/**
 * 获取所有南校区风景照片
 */
function getAllSouthScenery() {
  const south = cloudImages.scenery.south;
  return [
    ...south.teaching,
    ...south.library,
    ...south.canteen,
    ...south.dormitory,
    ...south.playground,
    ...south.garden,
    ...south.others
  ];
}

/**
 * 获取所有北校区风景照片
 */
function getAllNorthScenery() {
  const north = cloudImages.scenery.north;
  return [
    ...north.teaching,
    ...north.library,
    ...north.canteen,
    ...north.dormitory,
    ...north.playground,
    ...north.garden,
    ...north.others
  ];
}

/**
 * 获取所有校园生灵照片
 */
function getAllCreatures() {
  return [
    ...cloudImages.creatures.cats,
    ...cloudImages.creatures.dogs,
    ...cloudImages.creatures.birds,
    ...cloudImages.creatures.others
  ];
}

/**
 * 获取随机横屏壁纸
 */
function getRandomBanner() {
  const banners = cloudImages.banners;
  return banners[Math.floor(Math.random() * banners.length)];
}

/**
 * 预加载图片
 */
function preloadImages(imageUrls) {
  imageUrls.forEach(url => {
    wx.getImageInfo({
      src: url,
      success: () => {
        console.log('图片预加载成功:', url);
      },
      fail: (err) => {
        console.warn('图片预加载失败:', url, err);
      }
    });
  });
}

/**
 * 批量添加图片到指定分类
 * @param {String} category 分类路径，例如：'scenery.south.teaching'
 * @param {Array} fileNames 文件名数组，例如：['001.jpg', '002.jpg']
 */
function addImagesToCategory(category, fileNames) {
  const path = category.split('.');
  let target = cloudImages;
  
  // 导航到目标分类
  for (let i = 0; i < path.length; i++) {
    target = target[path[i]];
  }
  
  // 添加图片
  fileNames.forEach(fileName => {
    const fullPath = `${CLOUD_ENV_ID}/images/${category.replace(/\./g, '/')}/${fileName}`;
    target.push(fullPath);
  });
}

module.exports = {
  cloudImages,
  CLOUD_ENV_ID,
  getRandomBanner,
  preloadImages,
  getAllSouthScenery,
  getAllNorthScenery,
  getAllCreatures,
  addImagesToCategory
};
