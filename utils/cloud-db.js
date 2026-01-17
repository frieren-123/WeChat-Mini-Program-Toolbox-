/**
 * 云数据库工具类
 * 用于动态管理图片和配置
 */

// 延迟获取数据库实例，避免初始化顺序问题
function getDB() {
  return wx.cloud.database();
}

/**
 * 获取横幅图片列表
 * @returns {Promise<Array>} 横幅图片URL数组
 */
async function getBanners() {
  try {
    const db = getDB();
    const res = await db.collection('banners')
      .where({ enabled: true })
      .orderBy('order', 'asc')
      .get();
    
    console.log('获取横幅成功:', res.data.length, '张');
    return res.data.map(item => item.imageUrl);
  } catch (err) {
    console.error('获取横幅失败:', err);
    // 返回默认图片
    return [
      'cloud://frieren-cloud-0gd6n3lr386ef01d.6672-frieren-cloud-0gd6n3lr386ef01d/images/banners/001.jpg',
      'cloud://frieren-cloud-0gd6n3lr386ef01d.6672-frieren-cloud-0gd6n3lr386ef01d/images/banners/002.jpg',
      'cloud://frieren-cloud-0gd6n3lr386ef01d.6672-frieren-cloud-0gd6n3lr386ef01d/images/banners/003.jpg',
    ];
  }
}

/**
 * 获取校园风景列表
 * @param {String} campus - 校区（south/north）
 * @returns {Promise<Array>} 风景图片数组
 */
async function getScenery(campus = 'south') {
  try {
    const db = getDB();
    const res = await db.collection('scenery')
      .where({ 
        enabled: true,
        campus: campus
      })
      .orderBy('order', 'asc')
      .get();
    
    console.log('获取风景成功:', res.data.length, '张');
    return res.data;
  } catch (err) {
    console.error('获取风景失败:', err);
    // 返回默认数据
    return [
      {
        id: 101,
        name: '南校区·正门',
        image: 'cloud://frieren-cloud-0gd6n3lr386ef01d.6672-frieren-cloud-0gd6n3lr386ef01d/images/scenery/south/0001.jpg',
        location: '南校区'
      },
      {
        id: 102,
        name: '南校区·南门附近',
        image: 'cloud://frieren-cloud-0gd6n3lr386ef01d.6672-frieren-cloud-0gd6n3lr386ef01d/images/scenery/south/0002.jpg',
        location: '南校区'
      }
    ];
  }
}

/**
 * 获取校园生灵列表
 * @param {String} campus - 校区（south/north）
 * @returns {Promise<Array>} 生灵图片数组
 */
async function getCreatures(campus = 'south') {
  try {
    const db = getDB();
    const res = await db.collection('creatures')
      .where({ 
        enabled: true,
        campus: campus
      })
      .orderBy('order', 'asc')
      .get();
    
    console.log('获取生灵成功:', res.data.length, '个');
    return res.data;
  } catch (err) {
    console.error('获取生灵失败:', err);
    return [];
  }
}

/**
 * 获取启动通知配置
 * @returns {Promise<Object|null>} 通知配置对象
 */
async function getAppNotice() {
  try {
    const db = getDB();
    const res = await db.collection('config')
      .where({ 
        _id: 'app_notice',
        enabled: true
      })
      .get();
    
    if (res.data.length > 0) {
      console.log('获取通知成功');
      return res.data[0];
    }
    return null;
  } catch (err) {
    console.error('获取通知失败:', err);
    return null;
  }
}

/**
 * 检查是否需要显示通知
 * @returns {Promise<Boolean>}
 */
async function shouldShowNotice() {
  const notice = await getAppNotice();
  
  if (!notice) return false;
  
  // 如果设置了只显示一次
  if (notice.showOnce) {
    const lastVersion = wx.getStorageSync('last_notice_version');
    if (lastVersion === notice.version) {
      return false; // 已经显示过了
    }
  }
  
  return true;
}

/**
 * 标记通知已显示
 * @param {String} version - 通知版本号
 */
function markNoticeShown(version) {
  wx.setStorageSync('last_notice_version', version);
}

module.exports = {
  getBanners,
  getScenery,
  getCreatures,
  getAppNotice,
  shouldShowNotice,
  markNoticeShown
};
