function round(num) {
  if (Number.isNaN(num) || !Number.isFinite(num)) return '错误';
  const rounded = Math.round((num + Number.EPSILON) * 1e12) / 1e12;
  return String(rounded);
}

const TABLES = {
  长度: {
    base: 'm',
    units: {
      mm: 0.001,
      cm: 0.01,
      m: 1,
      km: 1000,
    },
  },
  重量: {
    base: 'kg',
    units: {
      g: 0.001,
      kg: 1,
      t: 1000,
    },
  },
};

const TEMP_UNITS = ['℃', '℉', 'K'];

function tempToC(value, unit) {
  switch (unit) {
    case '℃':
      return value;
    case '℉':
      return (value - 32) * (5 / 9);
    case 'K':
      return value - 273.15;
    default:
      return value;
  }
}

function cToTemp(c, unit) {
  switch (unit) {
    case '℃':
      return c;
    case '℉':
      return c * (9 / 5) + 32;
    case 'K':
      return c + 273.15;
    default:
      return c;
  }
}

Page({
  data: {
    categories: ['长度', '重量', '温度'],
    categoryIndex: 0,

    inputValue: '',

    fromUnits: ['mm', 'cm', 'm', 'km'],
    toUnits: ['mm', 'cm', 'm', 'km'],
    fromIndex: 2,
    toIndex: 3,

    resultText: '—',
  },

  onCategoryChange(e) {
    const categoryIndex = Number(e.detail.value);
    const category = this.data.categories[categoryIndex];

    if (category === '温度') {
      this.setData({
        categoryIndex,
        fromUnits: TEMP_UNITS,
        toUnits: TEMP_UNITS,
        fromIndex: 0,
        toIndex: 1,
      });
    } else {
      const units = Object.keys(TABLES[category].units);
      this.setData({
        categoryIndex,
        fromUnits: units,
        toUnits: units,
        fromIndex: 0,
        toIndex: Math.min(1, units.length - 1),
      });
    }

    this.recalculate();
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
    this.recalculate();
  },

  onFromChange(e) {
    this.setData({ fromIndex: Number(e.detail.value) });
    this.recalculate();
  },

  onToChange(e) {
    this.setData({ toIndex: Number(e.detail.value) });
    this.recalculate();
  },

  recalculate() {
    const { categories, categoryIndex, inputValue, fromUnits, toUnits, fromIndex, toIndex } = this.data;
    const category = categories[categoryIndex];

    if (inputValue === '' || inputValue === '.' || inputValue === '-') {
      this.setData({ resultText: '—' });
      return;
    }

    const value = Number(inputValue);
    if (Number.isNaN(value)) {
      this.setData({ resultText: '错误' });
      return;
    }

    const fromUnit = fromUnits[fromIndex];
    const toUnit = toUnits[toIndex];

    let result;
    if (category === '温度') {
      const c = tempToC(value, fromUnit);
      result = cToTemp(c, toUnit);
    } else {
      const table = TABLES[category];
      const fromFactor = table.units[fromUnit];
      const toFactor = table.units[toUnit];
      result = (value * fromFactor) / toFactor;
    }

    this.setData({
      resultText: `${round(result)} ${toUnit}`,
    });
  },
});
