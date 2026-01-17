/**
 * 云存储图片配置文件
 * 使用说明：
 * 1. 将 CLOUD_ENV_ID 替换为你的云环境ID
 * 2. 上传图片到云存储后，更新对应的路径
 * 3. 在页面中引入：const cloudImages = require('../../utils/cloud-images.js')
 */

// 云环境ID（完整路径）
// 格式：cloud://环境ID.xxxx-环境ID
const CLOUD_ENV_ID = 'cloud://frieren-cloud-0gd6n3lr386ef01d.6672-frieren-cloud-0gd6n3lr386ef01d';

/**
 * 云存储图片路径配置
 * 大图片（>80KB）放云端，小图标保留本地
 */
const cloudImages = {
  // ==================== 横屏壁纸（首页轮播）====================
  banners: [
    `${CLOUD_ENV_ID}/images/banners/001.jpg`,
    `${CLOUD_ENV_ID}/images/banners/002.jpg`,
    `${CLOUD_ENV_ID}/images/banners/003.jpg`,
    `${CLOUD_ENV_ID}/images/banners/004.jpg`,
    `${CLOUD_ENV_ID}/images/banners/005.jpg`,
    `${CLOUD_ENV_ID}/images/banners/006.jpg`,
    `${CLOUD_ENV_ID}/images/banners/007.jpg`,
  ],

  // ==================== 首页卡片图片 ====================
  homeCards: {
    card001: `${CLOUD_ENV_ID}/images/cards/001.jpg`,
    card002: `${CLOUD_ENV_ID}/images/cards/002.jpg`,
    card003: `${CLOUD_ENV_ID}/images/cards/003.jpg`,
    card004: `${CLOUD_ENV_ID}/images/cards/004.jpg`,
    card005: `${CLOUD_ENV_ID}/images/cards/005.jpg`,
    card006: `${CLOUD_ENV_ID}/images/cards/006.jpg`,
    card007: `${CLOUD_ENV_ID}/images/cards/007.jpg`,
    card008: `${CLOUD_ENV_ID}/images/cards/008.jpg`,
    card009: `${CLOUD_ENV_ID}/images/cards/009.jpg`,
    card010: `${CLOUD_ENV_ID}/images/cards/010.jpg`,
  },

  // ==================== 校园风景（河南理工大学）====================
  scenery: [
    `${CLOUD_ENV_ID}/images/scenery/south/0001.jpg`,
    `${CLOUD_ENV_ID}/images/scenery/south/0002.jpg`,
    `${CLOUD_ENV_ID}/images/scenery/south/0003.jpg`,
    `${CLOUD_ENV_ID}/images/scenery/south/0004.jpg`,
    `${CLOUD_ENV_ID}/images/scenery/south/0005.jpg`,
    `${CLOUD_ENV_ID}/images/scenery/south/0006.jpg`,
    `${CLOUD_ENV_ID}/images/scenery/south/0007.jpg`,
  ],

  // ==================== 校园生灵（猫咪等）====================
  creatures: [
    `${CLOUD_ENV_ID}/images/creatures/south/001.jpg`,
  ],

  // ==================== 本地小图标（保留在本地包）====================
  local: {
    // 芙莉莲头像
    frieren004: '/images/frieren004.jpg', // 66KB
    frieren005: '/images/frieren005.jpg', // 29KB
    
    // 工具图标
    icon002: '/images/002.jpg', // 64KB
    icon003: '/images/003.jpg', // 75KB
    icon004: '/images/004.jpg', // 79KB
    icon008: '/images/008.jpg', // 53KB
    icon009: '/images/009.jpg', // 76KB
    icon010: '/images/010.jpg', // 77KB
    icon011: '/images/011.jpg', // 67KB
  }
};

/**
 * 获取随机横屏壁纸
 */
function getRandomBanner() {
  const banners = cloudImages.banners;
  return banners[Math.floor(Math.random() * banners.length)];
}

/**
 * 预加载图片（提升用户体验）
 * @param {Array} imageUrls 图片URL数组
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
 * 获取图片信息（带错误处理）
 * @param {String} imageUrl 图片URL
 * @param {Function} callback 回调函数
 */
function getImageWithFallback(imageUrl, fallbackUrl = '/images/frieren004.jpg') {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: imageUrl,
      success: (res) => {
        resolve(imageUrl);
      },
      fail: (err) => {
        console.warn('云图片加载失败，使用备用图片:', err);
        resolve(fallbackUrl);
      }
    });
  });
}

module.exports = {
  cloudImages,
  getRandomBanner,
  preloadImages,
  getImageWithFallback,
  CLOUD_ENV_ID
};
