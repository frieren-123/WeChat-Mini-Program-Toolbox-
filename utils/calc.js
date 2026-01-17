/**
 * 计算器工具函数
 */

/**
 * 计算表达式
 * @param {string} expression - 数学表达式
 * @returns {number|string} 计算结果或错误信息
 */
function compute(expression) {
  try {
    // 替换特殊符号
    expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
    
    // 使用 Function 构造函数安全计算
    const result = new Function('return ' + expression)();
    
    if (!isFinite(result)) {
      return '错误';
    }
    
    return result;
  } catch (error) {
    return '错误';
  }
}

/**
 * 格式化数字显示
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
  if (typeof num !== 'number') {
    return String(num);
  }
  
  // 处理小数精度
  const str = num.toString();
  if (str.includes('e')) {
    return num.toExponential(6);
  }
  
  // 限制小数位数
  if (str.includes('.')) {
    const parts = str.split('.');
    if (parts[1].length > 8) {
      return num.toFixed(8).replace(/\.?0+$/, '');
    }
  }
  
  return str;
}

module.exports = {
  compute,
  formatNumber
};
