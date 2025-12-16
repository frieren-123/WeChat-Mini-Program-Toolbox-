const { compute, formatNumber } = require('../../../utils/calc');

Page({
  data: {
    display: '0',
    accumulator: null,
    pendingOperator: '',
    overwrite: true,
  },

  onClear() {
    this.setData({
      display: '0',
      accumulator: null,
      pendingOperator: '',
      overwrite: true,
    });
  },

  onBackspace() {
    const { display, overwrite } = this.data;
    if (overwrite) return;

    if (display.length <= 1) {
      this.setData({ display: '0', overwrite: true });
      return;
    }

    const next = display.slice(0, -1);
    this.setData({ display: next });
  },

  onDigit(e) {
    const digit = String(e.currentTarget.dataset.digit);
    const { display, overwrite } = this.data;

    if (overwrite) {
      this.setData({ display: digit, overwrite: false });
      return;
    }

    if (display === '0') {
      this.setData({ display: digit });
      return;
    }

    this.setData({ display: display + digit });
  },

  onDot() {
    const { display, overwrite } = this.data;

    if (overwrite) {
      this.setData({ display: '0.', overwrite: false });
      return;
    }

    if (display.includes('.')) return;
    this.setData({ display: display + '.' });
  },

  onOperator(e) {
    const op = e.currentTarget.dataset.op;
    const { display, accumulator, pendingOperator, overwrite } = this.data;
    const current = Number(display);

    if (accumulator === null) {
      this.setData({
        accumulator: current,
        pendingOperator: op,
        overwrite: true,
      });
      return;
    }

    // If user taps operator repeatedly, just change the pending operator.
    if (overwrite) {
      this.setData({ pendingOperator: op });
      return;
    }

    const nextAcc = compute(accumulator, pendingOperator, current);
    this.setData({
      accumulator: nextAcc,
      pendingOperator: op,
      display: formatNumber(nextAcc),
      overwrite: true,
    });
  },

  onEquals() {
    const { display, accumulator, pendingOperator, overwrite } = this.data;
    if (!pendingOperator || accumulator === null || overwrite) return;

    const current = Number(display);
    const result = compute(accumulator, pendingOperator, current);

    this.setData({
      display: formatNumber(result),
      accumulator: null,
      pendingOperator: '',
      overwrite: true,
    });
  },
});
