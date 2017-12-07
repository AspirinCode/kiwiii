// https://github.com/mojaie/kiwiii Version 0.8.3. Copyright 2017 Seiji Matsuoka.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
	(factory((global.main = {}),global.d3));
}(this, (function (exports,d3) { 'use strict';

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


function defaultFieldProperties(fields) {
  return fields.map(e => {
    if (!e.hasOwnProperty('name')) e.name = e.key;
    if (!e.hasOwnProperty('visible')) e.visible = true;
    if (e.hasOwnProperty('d3_format')) e.format = 'd3_format';
    if (!e.hasOwnProperty('format')) e.format = 'raw';
    return e;
  });
}


function sortType(fmt) {
  if (['numeric', 'd3_format'].includes(fmt)) return 'numeric';
  if (['text', 'compound_id'].includes(fmt)) return 'text';
  return 'none';
}


function ongoing(data) {
  return ['running', 'ready'].includes(data.status);
}


var definition = {
  defaultFieldProperties, sortType, ongoing
};

/** @module helper/formatValue */

/**
 * Format number
 * @param {object} value - value
 * @param {string} type - si | scientific | rounded | raw
 */
function formatNum(value, d3format) {
  if (value === undefined || value === null || Number.isNaN(value)) return '';
  return value == parseFloat(value) ? d3.format(d3format)(value) : value;
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
