
/** @module common/scale */

import d3 from 'd3';


const presets = [
  {key: 'activity', name: 'Activity', scale: 'log', domain: [1e-4, 1e-6]},
  {key: 'percent', name: 'Percent', scale: 'linear', domain: [0, 100]},
  {key: 'tf', name: 'True/False', scale: 'quantize', domain: [1, 0]},
  {key: 'mw', name: 'MW', scale: 'linear', domain: [200, 600]},
  {key: 'logp', name: 'LogP', scale: 'linear', domain: [-2, 8]}
];


const types = [
  {key: 'linear', name: 'Linear', func: d3.scaleLinear()},
  {key: 'log', name: 'Log', func: d3.scaleLog()},
  {key: 'quantize', name: 'Quantize', func: d3.scaleQuantize()},
  {key: 'ordinal', name: 'Ordinal', func: d3.scaleOrdinal()}  // not for sizeScale
];


const colorPalettes = [
  {key: 'aquamarine', name: 'Aquamarine',
   range: ['#778899', '#7fffd4'], unknown: '#f0f0f0'},
  {key: 'chartreuse', name: 'Chartreuse',
   range: ['#778899', '#7fff00'], unknown: '#f0f0f0'},
  {key: 'salmon', name: 'Salmon',
   range: ['#778899', '#fa8072'], unknown: '#f0f0f0'},
  {key: 'violet', name: 'Violet',
   range: ['#778899', '#ee82ee'], unknown: '#f0f0f0'},
  {key: 'temperature', name: 'Temperature',
   range: ['#87ceeb', '#fff5ee', '#fa8072'], unknown: '#f0f0f0'},
  {key: 'spectrum', name: 'Spectrum',
   range: ['#6495ed', '#ccff66', '#ffa500'], unknown: '#f0f0f0'}
];


// TODO: Remove gray (for unknown) from categorical 20 and 40
const colorRangeTypes = [
  {key: 'continuous', name: 'Continuous', size: 2},
  {key: 'two-piece', name: 'Two-piece', size: 3},
  {key: 'category10', name: 'Category 10', size: 10,
   range: ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462',
    '#b3de69','#fccde5','#bc80bd','#ccebc5'], unknown: '#f0f0f0'},
  {key: 'cbsafe', name: 'Colorblind safe', size: 10,
   range: ['#543005','#8c510a','#bf812d','#dfc27d','#f6e8c3','#c7eae5',
   '#80cdc1','#35978f','#01665e','#003c30'], unknown: '#f0f0f0'},
  {key: 'category20', name: 'Category 20', size: 20,
   range: d3.schemePaired.concat(d3.schemeSet2), unknown: '#f0f0f0'},
  {key: 'category40', name: 'Category 40', size: 40,
   range: d3.schemePaired.concat(d3.schemePastel2, d3.schemeSet2, d3.schemeSet3),
   unknown: '#f0f0f0'}
];


function scaleFunction(attr) {
  let sf = types.find(e => e.key == attr.scale).func;
  let domain = attr.domain;
  if (attr.range.length == 3) {
    const mid = (parseFloat(attr.domain[0]) + parseFloat(attr.domain[1])) / 2;
    domain = [attr.domain[0], mid, attr.domain[1]];
  }
  if (attr.scale !== 'ordinal') {
    sf = sf.domain(domain);
  }
  sf = sf.range(attr.range);
  if (['linear', 'log'].includes(attr.scale)) {
    sf = sf.clamp(true);
  }
  return d => {
    if (d === '' || typeof d === 'undefined' || d === null) {
      return attr.unknown;  // invalid values
    }
    if (attr.scale !== 'ordinal' && parseFloat(d) != d) {
      return attr.unknown;  // texts
    }
    if (attr.scale === 'log' && d <= 0) {
      return attr.unknown;  // negative values in log scale
    }
    const result = sf(d);
    if (result === undefined) {
      return attr.unknown;  // TODO: specify unexpected behavior
    }
    return result;
  };
}


export default {
  presets, types, colorPalettes, colorRangeTypes,
  scaleFunction
};
