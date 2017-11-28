// https://github.com/mojaie/kiwiii Version 0.8.0. Copyright 2017 Seiji Matsuoka.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
	(factory((global.main = {}),global.d3));
}(this, (function (exports,d3) { 'use strict';

const debug = true;

d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;

class KArray extends Array {
  /**
   * Return array of object filtered by given unique key
   */
  unique(key) {
    return this.reduce((a, b) => {
      if (a.find(e => e[key] === b[key]) === undefined) a.push(b);
      return a;
    }, new KArray());
  }


  /**
   * Merge arrays
   */
  extend() {
    return this.reduce((a, b) => {
      Array.prototype.push.apply(a, b);
      return a;
    }, new KArray());
  }


  // Merge arrays(Asynchronous)
  extendAsync() {
    return Promise.all(this).then(res => {
      return res.reduce((a, b) => {
        Array.prototype.push.apply(a, b);
        return a;
      }, new KArray());
    });
  }

  toArray() {
    return new Array(this);
  }

  toObject() {
    const obj = {};
    this.forEach(kv => {
      obj[kv[0]] = kv[1];
    });
    return obj;
  }
}

/** @module helper/definition */


const defaultHiddenFields = ['_mw', '_mw_wo_sw', '_logp', '_formula', '_nonH'];

// TODO: timestamp sort
const defaultSort = {
    id: 'text',
    compound_id: 'text',
    assay_id: 'text',
    svg: 'none',
    json: 'none',
    plot: 'none',
    text: 'text',
    ec50: 'numeric',
    'active%': 'numeric',
    'inhibition%': 'numeric',
    filesize: 'numeric',
    numeric: 'numeric',
    count: 'numeric',
    int: 'numeric',
    flag: 'numeric',
    bool: 'numeric',
    timestamp: 'none',
    image: 'none',
    control: 'none',
    'undefined': 'none'
};

const defaultDigit = {
    id: 'raw',
    compound_id: 'raw',
    assay_id: 'raw',
    svg: 'raw',
    json: 'raw',
    plot: 'raw',
    text: 'raw',
    ec50: 'scientific',
    'active%': 'rounded',
    'inhibition%': 'rounded',
    filesize: 'si',
    numeric: 'rounded',
    count: 'raw',
    int: 'raw',
    flag: 'raw',
    bool: 'raw',
    timestamp: 'raw',
    image: 'raw',
    control: 'raw',
    'undefined': 'raw'
};

function defaultFieldProperties(fields) {
  return fields.map(e => {
    if (!e.hasOwnProperty('name')) e.name = e.key;
    if (!e.hasOwnProperty('visible')) e.visible = !defaultHiddenFields.includes(e.key);
    if (!e.hasOwnProperty('sortType')) e.sortType = defaultSort[e.valueType];
    if (!e.hasOwnProperty('digit')) e.digit = defaultDigit[e.valueType];
    return e;
  });
}

function ongoing(data) {
  return ['running', 'ready'].includes(data.status);
}


var definition = {
  defaultHiddenFields, defaultFieldProperties, ongoing
};

/** @module helper/formatValue */

/**
 * Format number
 * @param {object} value - value
 * @param {string} type - si | scientific | rounded | raw
 */
function formatNum(value, type) {
  const conv = {
    scientific: ".3e",
    si: ".3s",
    rounded: ".3r"
  };
  if (type === 'raw') return value;
  if (value === undefined || value === null || Number.isNaN(value)) return '';
  return value == parseFloat(value) ? d3.format(conv[type])(value) : value;
}

function partialMatch(query, target) {
  if (target === undefined || target === null || target === '') return false;
  return target.toString().toUpperCase()
    .indexOf(query.toString().toUpperCase()) !== -1;
}

function numericAsc(a, b) {
  const fa = parseFloat(a);
  const fb = parseFloat(b);
  if (isNaN(fa) || isNaN(fb)) {
    return String(b).localeCompare(String(a));
  }
  return fb - fa;
}


function numericDesc(a, b) {
  return numericAsc(b, a);
}


function textAsc(a, b) {
  return String(b).localeCompare(String(a));
}


function textDesc(a, b) {
  return textAsc(b, a);
}


var formatValue = {
  formatNum, partialMatch,
  numericAsc, numericDesc, textAsc, textDesc
};

exports.KArray = KArray;
exports.def = definition;
exports.fmt = formatValue;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=main.js.map
