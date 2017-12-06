// https://github.com/mojaie/kiwiii Version 0.8.1. Copyright 2017 Seiji Matsuoka.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('d3')) :
	typeof define === 'function' && define.amd ? define(['d3'], factory) :
	(factory(global.d3));
}(this, (function (d3) { 'use strict';

d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;

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


var def = {
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


var fmt = {
  formatNum, partialMatch,
  numericAsc, numericDesc, textAsc, textDesc
};

/** @module component/Component */

function selectOptions(selection, data, key, text) {
  const options = selection.selectAll('option')
    .data(data, key);
  options.exit().remove();
  options.enter().append('option')
    .merge(options)
      .attr('value', key)
      .text(text);
}


function checkboxList(selection, data, name, key, text) {
  const items = selection.selectAll('li').data(data, key);
  items.exit().remove();
  const entered = items.enter().append('li')
    .attr('class', 'form-check')
    .append('label');
  entered.append('input');
  entered.append('span');
  const updated = entered.merge(items.select('label'))
    .attr('class', 'form-check-label');
  updated.select('input')
    .attr('type', 'checkbox')
    .attr('class', 'form-check-input')
    .attr('name', name)
    .attr('value', key);
  updated.select('span')
    .text(text);
}


// checkbox list with tooltip
// call $('[data-toggle="tooltip"]').tooltip() after this function
function checkboxListT(selection, data, name, key, text) {
  const items = selection.selectAll('li').data(data, key);
  items.exit().remove();
  const entered = items.enter().append('li')
    .attr('class', 'form-check')
    .append('label');
  entered.append('input');
  entered.append('a');
  const updated = entered.merge(items.select('label'))
    .attr('class', 'form-check-label');
  updated.select('input')
    .attr('type', 'checkbox')
    .attr('class', 'form-check-input')
    .attr('name', name)
    .attr('value', key);
  updated.select('a')
    .attr('data-toggle', 'tooltip')
    .attr('data-placement', 'bottom')
    .attr('title', d => d.description || 'No')
    .text(text);
}


function createTable(selection, data) {
  // Header
  if (selection.select('thead').size()) selection.select('thead').remove();
  selection.append('thead').append('tr');
  // Records
  if (selection.select('tbody').size()) selection.select('tbody').remove();
    selection.append('tbody');

  const cols = data.fields.filter(e => e.visible);
  const header = selection.select('thead tr').selectAll('th')
    .data(cols, d => d.key);
  header.exit().remove();
  header.enter().append('th')
    .merge(header)
      .text(d => d.name);
}


function updateTableRecords(selection, rcds, keyFunc) {
  const header = selection.select('thead tr').selectAll('th')
    .data();
  const rowSelection = selection.select('tbody').selectAll('tr')
    .data(rcds, keyFunc);
  rowSelection.exit().remove();
  const rowEntered = rowSelection.enter().append('tr');
  rowEntered.selectAll('td')
    .data(d => header.map(e => d[e.key]))
    .enter().append('td');
  rowEntered.merge(rowSelection)
    .selectAll('td')
      .classed('align-middle', true)
    .html(function (d, i) {
      if (d === undefined) return '';
      if (header[i].format === 'd3_format') {
        return fmt.formatNum(d, header[i].d3_format);
      }
      if (header[i].format === 'plot') return '[plot]';
      if (header[i].format === 'image') return '[image]';
      if (header[i].format === 'control') return;
      return d;
    })
    .each((d, i, nodes) => {
      // This should be called after html
      if (header[i].format === 'control') d3.select(nodes[i]).call(d);
    });
}


function appendTableRows(selection, rcds, keyFunc) {
  const newRcds = selection.select('tbody').selectAll('tr').data();
  Array.prototype.push.apply(newRcds, rcds);
  updateTableRecords(selection, newRcds, keyFunc);
}


function addSort(selection) {
  selection.select('thead tr').selectAll('th')
    .filter(d => def.sortType(d.format) !== 'none')
    .append('span').append('a')
      .attr('id', d => `sort-${d.key}`)
      .text('^v')
      .style('display', 'inline-block')
      .style('width', '30px')
      .style('text-align', 'center')
    .on('click', d => {
      const isAsc = d3.select(`#sort-${d.key}`).text() === 'v';
      const isNum = def.sortType(d.format) === 'numeric';
      const cmp = isAsc
        ? (isNum ? fmt.numericAsc : fmt.textAsc)
        : (isNum ? fmt.numericDesc : fmt.textDesc);
      selection.select('tbody').selectAll('tr')
        .sort((a, b) => cmp(a[d.key], b[d.key]));
      d3.select(`#sort-${d.key}`)
        .text(isAsc ? '^' : 'v');
    });
}


function formatNumbers(selection) {
  // DEPRECATED: no longer used
  selection.select('thead tr').selectAll('th')
    .each((col, colIdx) => {
      if (col.digit === 'raw') return;
      selection.select('tbody').selectAll('tr')
        .selectAll('td')
          .filter((d, i) => i === colIdx)
          .text(d => fmt.formatNum(d, col.digit));
    });
}


var cmp = {
  selectOptions, checkboxList, checkboxListT,
  createTable, updateTableRecords,
  appendTableRows, addSort, formatNumbers
};

const baseURL = '';

function get(url, query={}) {
  const isEmpty = Object.keys(query).length;
  const q = isEmpty ? `?query=${JSON.stringify(query)}` : '';
  return fetch(
    `${baseURL}${url}${q}`,
    {
      credentials: 'include'
    }
  ).then(res => {
    if (res.status !== 200) {
      return Promise.reject(new Error(res.statusText));
    }
    return Promise.resolve(res);
  });
}

function json(response) {
  return response.json();
}

function text(response) {
  return response.text();
}

function blob(response) {
  return response.blob();
}

function post(url, formdata) {
  return fetch(
    `${baseURL}${url}`,
    {
      method: 'POST',
      body: formdata,
      credentials: 'include'
    }
  ).then(res => {
    if (res.status !== 200) {
      return Promise.reject(new Error(res.statusText));
    }
    return Promise.resolve(res);
  });
}


function error(err) {
  console.error(err);
  return null;
}


var fetcher = {
  get, json, text, blob, post, error
};

const testCases = [];

testCases.push(() =>
  fetcher.get('server').then(fetcher.json)
    .then(res => ({output: res, test: 'server', pass: true}))
    .catch(err => ({output: err, test: 'server', pass: false}))
);

testCases.push(() =>
  fetcher.get('schema').then(fetcher.json)
    .then(res => ({output: res, test: 'schema', pass: true}))
    .catch(err => ({output: err, test: 'schema', pass: false}))
);

testCases.push(() =>
  fetcher.get('run', {
    type: 'chemsearch',
    targets: ['drugbankfda'],
    key: 'compound_id',
    values: ['DB00189', 'DB00193', 'DB00203', 'DB00865', 'DB01143']
  }).then(fetcher.json)
    .then(res => ({output: res, test: 'chemsearch', pass: true}))
    .catch(err => ({output: err, test: 'chemsearch', pass: false}))
);

testCases.push(() =>
  fetcher.get('run', {
    type: 'filter',
    targets: ['exp_results'],
    key: 'compound_id',
    values: ['DB00189', 'DB00193', 'DB00203', 'DB00865', 'DB01143'],
    operator: 'in'
  }).then(fetcher.json)
    .then(res => ({output: res, test: 'filter', pass: true}))
    .catch(err => ({output: err, test: 'filter', pass: false}))
);

testCases.push(() =>
  fetcher.get('run', {
    type: 'profile',
    compound_id: 'DB00189'
  }).then(fetcher.json)
    .then(res => ({output: res, test: 'profile', pass: true}))
    .catch(err => ({output: err, test: 'profile', pass: false}))
);

testCases.push(() =>
  fetcher.get('strprev', {
    format: 'dbid',
    source: 'drugbankfda',
    value: 'DB00115'
  }).then(fetcher.text)
    .then(res => ({
      output: new DOMParser().parseFromString(res, "image/svg+xml"),
      test: 'strprev', pass: true
    }))
    .catch(err => ({output: err, test: 'strprev', pass: false}))
);

testCases.push(() =>
  new Promise(r => {
    fetcher.get('async', {
      type: 'substr',
      targets: ['drugbankfda'],
      queryMol: {
        format: 'dbid',
        source: 'drugbankfda',
        value: 'DB00115'
      },
      params: {
        ignoreHs: true
      }
    }).then(fetcher.json)
      .then(res => {
        setTimeout(() => {
          const query = {id: res.id, command: 'abort'};
          fetcher.get('res', query).then(fetcher.json).then(rows => r([res, rows]));
        }, 2000);
      });
  }).then(res => ({output: res, test: 'substr', pass: true}))
    .catch(err => ({output: err, test: 'substr', pass: false}))
);

testCases.push(() =>
  new Promise(r => {
    fetcher.get('async', {
      type: 'chemprop',
      targets: ['drugbankfda'],
      key: '_mw',
      values: [1000],
      operator: 'gt'
    }).then(fetcher.json)
      .then(res => {
        setTimeout(() => {
          const query = {id: res.id, command: 'abort'};
          fetcher.get('res', query).then(fetcher.json).then(rows => r([res, rows]));
        }, 2000);
      });
  }).then(res => ({output: res, test: 'prop', pass: true}))
    .catch(err => ({output: err, test: 'prop', pass: false}))
);

testCases.push(() =>
  fetcher.get('run', {
    type: 'chemsearch',
    targets: ['drugbankfda'],
    key: 'compound_id',
    values: ['DB00186', 'DB00189', 'DB00193', 'DB00203', 'DB00764', 'DB00863',
             'DB00865', 'DB00868', 'DB01143', 'DB01240', 'DB01242', 'DB01361',
             'DB01366', 'DB02638', 'DB02959']
  }).then(fetcher.json)
    .then(res =>
      new Promise(r => {
        const params = {
          measure: 'gls', threshold: 0.25, ignoreHs: true,
          diameter: 8, maxTreeSize: 40, molSizeCutoff: 500
        };
        const formData = new FormData();
        formData.append('contents', new Blob([JSON.stringify(res)]));
        formData.append('params', JSON.stringify(params));
        fetcher.post('simnet', formData)
          .then(fetcher.json)
          .then(res => {
            setTimeout(() => {
              const query = {id: res.id, command: 'abort'};
              fetcher.get('res', query).then(fetcher.json).then(rows => r([res, rows]));
            }, 2000);
          });
      }).then(res => ({output: res, test: 'simnet', pass: true}))
        .catch(err => ({output: err, test: 'simnet', pass: false}))
    )
);

function run() {
  const tbl = {
      fields: def.defaultFieldProperties([
        {key: 'test'},
        {key: 'result'}
      ]),
      records: []
  };
  d3.select('#test').call(cmp.createTable, tbl);
  testCases.reduce((ps, curr) => {
    return () => ps()
      .then(curr)
      .then(res => {
        console.info(res.test);
        console.info(res.output);
        const pass = res.pass ? 'OK' : '<span class="text-danger">NG<span>';
        const row = [{'test': res.test, 'result': pass}];
        cmp.appendTableRows(d3.select('#test'), row, d => d.key);
      })
      ;
  }, () => Promise.resolve())();
}
run();

})));
//# sourceMappingURL=testAPI.js.map
