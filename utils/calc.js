function formatNumber(num) {
  if (Number.isNaN(num) || !Number.isFinite(num)) return '错误';
  // Avoid long floating-point tails; keep reasonable precision.
  const rounded = Math.round((num + Number.EPSILON) * 1e12) / 1e12;
  return String(rounded);
}

function compute(a, operator, b) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

module.exports = {
  formatNumber,
  compute,
};
