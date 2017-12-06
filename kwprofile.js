// https://github.com/mojaie/kiwiii Version 0.8.1. Copyright 2017 Seiji Matsuoka.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3'), require('Dexie'), require('pako'), require('vega')) :
	typeof define === 'function' && define.amd ? define(['d3', 'Dexie', 'pako', 'vega'], factory) :
	(global.kwprofile = factory(global.d3,global.Dexie,global.pako,global.vega));
}(this, (function (d3,Dexie,pako,vega) { 'use strict';

d3 = d3 && d3.hasOwnProperty('default') ? d3['default'] : d3;
Dexie = Dexie && Dexie.hasOwnProperty('default') ? Dexie['default'] : Dexie;
pako = pako && pako.hasOwnProperty('default') ? pako['default'] : pako;
vega = vega && vega.hasOwnProperty('default') ? vega['default'] : vega;

/** @module helper/d3Form */

function value(selector) {
  return d3.select(selector).node().value;
}


function valueInt(selector) {
  return parseInt(d3.select(selector).node().value);
}


function valueFloat(selector) {
  return parseFloat(d3.select(selector).node().value);
}


function checked(selector) {
  return d3.select(selector).node().checked;
}


function firstFile(selector) {
  return d3.select(selector).node().files[0];
}


function inputValues(selector) {
  return d3.selectAll(selector).selectAll('input').nodes().map(e => e.value);
}


function checkboxValues(selector) {
  return d3.selectAll(selector).selectAll('input:checked').nodes().map(e => e.value);
}


function optionValues(selector) {
  return d3.selectAll(selector).selectAll('select').nodes().map(e => e.value);
}


function textareaLines(selector) {
  return d3.select(selector).node().value.split('\n').filter(e => e.length > 0);
}


function optionData(selector) {
  const si = d3.select(selector).property('selectedIndex');
  return d3.select(selector).selectAll('option').data().find((d, i) => i === si);
}


function checkboxData(selector) {
  return d3.selectAll(selector).selectAll('input:checked').data();
}


var d3form = {
  value, valueInt, valueFloat, checked,
  firstFile, inputValues, checkboxValues, optionValues, textareaLines,
  optionData, checkboxData
};

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
  if (fmt === 'd3_format') return 'numeric';
  if (fmt === 'numeric') return 'numeric';
  if (fmt === 'text') return 'text';
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

function URLQuery() {
  return KArray.from(window.location.search.substring(1).split("&"))
    .map(e => e.split('=')).toObject();
}


var win = {
  URLQuery
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

/** @module helper/parser */

function getSDFPropList(str) {
  const re = />.*?<(\S+)>/g;
  const uniqCols = new Set();
  let arr;
  while ((arr = re.exec(str)) !== null) {
    uniqCols.add(arr[1]);
  }
  return Array.from(uniqCols);
}

// Ref. https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var misc = {
  getSDFPropList, uuidv4
};

/** @module helper/dataStructure */

/**
 * Convert single field mapping to multi field mapping
 * @param {object} mapping - single field mapping
 * @return {object} multi field mapping
 */
function singleToMulti(mapping) {
  const newMapping = {};
  Object.entries(mapping.mapping).forEach(m => {
    newMapping[m[0]] = [m[1]];
  });
  return {
    created: mapping.created,
    fields: [mapping.field],
    key: mapping.key,
    mapping: newMapping
  };
}


/**
 * Convert field mapping to table
 * @param {object} mapping - field mapping
 * @return {object} table object
 */
function mappingToTable(mapping) {
  const mp = mapping.hasOwnProperty('field') ? singleToMulti(mapping) : mapping;
  const keyField = {key: mp.key, format: 'text'};
  const data = {
    fields: def.defaultFieldProperties([keyField].concat(mp.fields)),
    records: Object.entries(mp.mapping).map(entry => {
      const rcd = {};
      rcd[mp.key] = entry[0];
      mp.fields.forEach((f, i) => {
        rcd[f.key] = entry[1][i];
      });
      return rcd;
    })
  };
  return data;
}


/**
 * Convert table to field mapping
 * @param {object} table - table
 * @param {object} key - key
 * @return {object} field mapping
 */
function tableToMapping(table, key, ignore=['_index']) {
  const now = new Date();
  const mapping = {
    created: now.toString(),
    fields: def.defaultFieldProperties(table.fields
      .filter(e => e.key !== key)
      .filter(e => !ignore.includes(e.key))),
    key: key,
    mapping: {}
  };
  table.records.forEach(row => {
    mapping.mapping[row[key]] = mapping.fields.map(e => row[e.key]);
  });
  return mapping;
}


/**
 * Convert csv text to field mapping
 * @param {string} csvString - csv data text
 * @return {object} field mapping
 */
function csvToMapping(csvString) {
  const lines = csvString.split(/\n|\r|\r\n/);
  const header = lines.shift().split(',');
  const key = header.shift();
  const now = new Date();
  const headerIdx = [];
  const fields = [];
  header.forEach((h, i) => {
    if (h === '') return;
    headerIdx.push(i);
    fields.push({key: h, format: 'text'});
  });
  const mapping = {
    created: now.toString(),
    fields: def.defaultFieldProperties(fields),
    key: key,
    mapping: {}
  };
  lines.forEach(line => {
    const values = line.split(',');
    const k = values.shift();
    mapping.mapping[k] = Array(headerIdx.length);
    headerIdx.forEach(i => {
      mapping.mapping[k][i] = values[i];
    });
  });
  return mapping;
}


/**
 * Apply mapping to the data (in-place)
 * @param {object} data - datatable JSON
 * @param {object} mapping - mapping JSON
 * @return {undefined} undefined
 */
function apply(data, mapping) {
  const mp = mapping.hasOwnProperty('field') ? singleToMulti(mapping) : mapping;
  data.records
    .filter(rcd => mp.mapping.hasOwnProperty(rcd[mp.key]))
    .forEach(rcd => {
      mp.fields.forEach((fd, i) => {
        rcd[fd.key] = mp.mapping[rcd[mp.key]][i];
      });
    });
  data.fields = def.defaultFieldProperties(
    KArray.from(data.fields).concat(mp.fields).unique('key'));
}


var mapper = {
  singleToMulti, mappingToTable, tableToMapping, csvToMapping, apply
};

// TODO: can indexed records improve query performance ?

const schema = {
  app: 'key',
  items: 'id, dataType, created',
  resources: 'id'
};

let idb = new Dexie('Store');
idb.version(1).stores(schema);


function getAppSetting$1(key) {
  return idb.app.where('key').equals(key).first()
    .then(res => {
      if (res === undefined) return undefined;
      return res.value;
    });
}


function putAppSetting(k, v) {  // returns id in success
  return idb.app.put({ key: k, value: v });
}


function getResources$1() {
  return idb.resources.toArray();
}


function putResources(data) { // returns last id in success
  return idb.resources.bulkPut(data);
}


function getAllItems() {
  return idb.items.orderBy('created').reverse()
    .toArray();
}


function getItemsByDataType(type) {
  return idb.items.where('dataType').equals(type).reverse()
    .sortBy('created');
}


function getItemById(tableId) {
  return idb.items.where('id').equals(tableId).first();
}


function updateItem(tableId, callback) {  // returns num of updated items
  return idb.items.where('id').equals(tableId).modify(callback);
}


function deleteItem(tableId) { // returns num of deleted items
  return idb.items.where('id').equals(tableId).delete();
}


function putItem(data) { // returns id in success
  return idb.items.put(data);
}


function reset$1() {
  // Try this before tackling with local db troubles
  return idb.delete().then(() => {
    idb = new Dexie('Store');
    idb.version(1).stores(schema);
  });
}

var store$1 = {
  getAppSetting: getAppSetting$1, putAppSetting, getResources: getResources$1, putResources,
  getAllItems, getItemsByDataType, getItemById,
  updateItem, deleteItem, putItem, reset: reset$1
};

function getAppSetting(key) {
  return store$1.getAppSetting(key)
    .catch(err => {
      console.error(`Unexpected key: ${key}`);
      Promise.reject(err);
    });
}


function setAppSetting(key, value) {
  return store$1.putAppSetting(key, value)
    .catch(err => {
      console.error(`Unexpected key: ${key} or value: ${value}`);
      Promise.reject(err);
    });
}


function getResources() {
  return store$1.getResources();
}


function setResources(rsrcs) {
  return store$1.putResources(rsrcs)
    .catch(err => {
      console.error(`Unexpected resources: ${rsrcs}`);
      Promise.reject(err);
    });
}


function getAllTables() {
  return store$1.getAllItems();
}


function getTablesByDataType(type) {
  return store$1.getItemsByDataType(type)
    .catch(err => {
      console.error(`Unexpected dataType: ${type}`);
      Promise.reject(err);
    });
}


function getTable(id) {
  return store$1.getItemById(id)
    .catch(err => {
      console.error(`Unexpected table ID: ${id}`);
      Promise.reject(err);
    });
}


function setFieldProperties(id, updates) {
  return store$1.updateItem(id, item => {
    item.fields.forEach((fd, i) => {
      fd.visible = updates.visibles.includes(fd.key);
      fd.format = updates.formats[i];
      if (updates.d3_formats[i]) fd.d3_format = updates.d3_formats[i];
    });
    item.revision++;
  })
  .catch(err => {
    console.error(`Unexpected table ID: ${id} or updates: ${updates}`);
    Promise.reject(err);
  });
}


function joinFields(id, mapping) {
  return store$1.updateItem(id, item => {
    mapper.apply(item, mapping);
    item.revision++;
  })
  .catch(err => {
    console.error(`Unexpected table ID: ${id} or mapping: ${mapping}`);
    Promise.reject(err);
  });
}


function updateTableAttribute(id, key, value) {
  return store$1.updateItem(id, item => {
    item[key] = value;
    item.revision++;
  })
  .catch(err => {
    console.error(`Unexpected table ID: ${id}, key: ${key} or value: ${value}`);
    Promise.reject(err);
  });
}


function insertTable(data) {
  data.fields = def.defaultFieldProperties(data.fields);
  return store$1.putItem(data)
    .catch(err => {
      console.error(`Unexpected data: ${data}`);
      Promise.reject(err);
    });
}


function updateTable(data) {
  if (data.status === 'failure') {  // No data found on server
    return updateTableAttribute(data.id, 'status', 'failure');
  }
  // update
  return store$1.updateItem(data.id, item => {
    data.fields = def.defaultFieldProperties(data.fields);
    Object.assign(item, data);
    item.revision++;
  });
}


function deleteTable(id) {
  return store$1.deleteItem(id)
    .catch(err => {
      console.error(`Unexpected table ID: ${id}`);
      Promise.reject(err);
    });
}


function reset() {
  return store$1.reset();
}


var store = {
  getAppSetting, setAppSetting, getResources, setResources,
  getAllTables, getTablesByDataType, getTable,
  setFieldProperties, joinFields,
  updateTableAttribute, insertTable, updateTable,
  deleteTable, reset
};

/** @module helper/file */

const statusConv = {
  Queued: 'ready',
  'In progress': 'running',
  Aborting: 'running',
  Aborted: 'aborted',
  Completed: 'done',
  Failure: 'failure'
};

const dataTypeConv = {
  datatable: 'nodes',
  connection: 'edges'
};

function v07_to_v08_nodes(json) {
  const fields = json.columns.map(e => {
    e.format = 'raw';
    return e;
  });
  return {
    id: json.id,
    name: json.name,
    dataType: dataTypeConv[json.format],
    schemaVersion: 0.8,
    revision: 0,
    status: statusConv[json.status],
    fields: fields,
    records: json.records,
    query: json.query,
    taskCount: json.searchCount,
    doneCount: json.searchDoneCount | json.searchCount,
    resultCount: json.recordCount,
    progress: json.progress | 100,
    execTime: json.execTime,
    created: json.startDate | json.responseDate,
  };
}

function v07_to_v08_edges(json, nodeFields) {
  const snp = {
    fieldTransform: json.snapshot.fieldTransform,
    nodePositions: json.snapshot.nodePositions,
    nodeColor: {},
    nodeSize: {},
    nodeLabel: {},
    edge: {}
  };
  if (json.snapshot.hasOwnProperty('nodeColor')) {
    snp.nodeColor.id = json.snapshot.nodeColor.id;
    snp.nodeColor.scale = json.snapshot.nodeColor.scale;
    snp.nodeColor.field = nodeFields.find(e => e.key === json.snapshot.nodeColor.column);
  } else {
    snp.nodeColor = {
      id: 'color', field: nodeFields[0],
      scale: {scale: 'linear', domain: [0, 1], range: ['black', 'white'], unknown: 'gray'}
    };
  }
  if (json.snapshot.hasOwnProperty('nodeSize')) {
    snp.nodeSize.id = json.snapshot.nodeSize.id;
    snp.nodeSize.scale = json.snapshot.nodeSize.scale;
    snp.nodeSize.field = nodeFields.find(e => e.key === json.snapshot.nodeSize.column);
  } else {
    snp.nodeSize = {
      id: 'size', field: nodeFields[0],
      scale: {scale: 'linear', domain: [0, 1], range: [20, 20], unknown: 20}
    };
  }
  if (json.snapshot.hasOwnProperty('nodeLabel')) {
    snp.nodeLabel.id = json.snapshot.nodeLabel.id;
    snp.nodeLabel.size = json.snapshot.nodeLabel.size;
    snp.nodeLabel.text = json.snapshot.nodeLabel.text;
    snp.nodeLabel.visible = json.snapshot.nodeLabel.visible;
    snp.nodeLabel.scale = json.snapshot.nodeLabel.scale;
    snp.nodeLabel.field = nodeFields.find(e => e.key === json.snapshot.nodeLabel.column);
  } else {
    snp.nodeLabel = {
      id: 'label', size: 12, text: '_index', visible: false, field: nodeFields[0],
      scale: {scale: 'linear', domain: [0, 1], range: ['black', 'white'], unknown: 'gray'}
    };
  }
  if (json.snapshot.hasOwnProperty('nodeContent')) {
    snp.nodeContent = json.snapshot.nodeContent;
  } else {
    snp.nodeContent = {structure: {visible: false}};
  }
  if (json.snapshot.hasOwnProperty('edge')) {
    snp.edge = json.snapshot.edge;
  } else {
    snp.edge = {
      id: 'label', label: {size: 10, visible: false}, visible: true,
      scale: {scale: 'linear', domain: [0, 1], range: [5, 5], unknown: 5}
    };
  }
  return {
    id: json.id,
    name: json.name,
    dataType: dataTypeConv[json.format],
    schemaVersion: 0.8,
    revision: 0,
    reference: {
      nodes: json.nodeTableId
    },
    status: statusConv[json.status],
    fields: def.defaultFieldProperties([
      {'key': 'source'},
      {'key': 'target'},
      {'key': 'weight'}
    ]),
    records: json.records,
    query: json.query,
    networkThreshold: json.networkThreshold,
    taskCount: json.searchCount,
    doneCount: json.searchDoneCount | json.searchCount,
    resultCount: json.recordCount,
    progress: json.progress | 100,
    execTime: json.execTime,
    created: json.startDate | json.responseDate,
    snapshot: snp
  };
}

function v07_to_v08_convert(json) {
  if (json.hasOwnProperty('edges')) {
    const nodes = v07_to_v08_nodes(json.nodes);
    const edges = v07_to_v08_edges(json.edges, nodes.fields);
    return {nodes: nodes, edges: edges};
  } else {
    return v07_to_v08_nodes(json);
  }
}


function readFile(file, sizeLimit, blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const truncated = sizeLimit ? file.slice(0, sizeLimit) : file;
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    if (blob) {
      reader.readAsArrayBuffer(truncated);
    } else {
      reader.readAsText(truncated);
    }
  });
}


function parseJSON(data, compressed) {
  const text = compressed ? pako.inflate(data, {to: 'string'}) : data;
  const json = JSON.parse(text);
  if (json.hasOwnProperty('schemaVersion')) return json;
  if (json.hasOwnProperty('edges')) {
    if (json.edges.hasOwnProperty('schemaVersion')) return json;
  }
  return v07_to_v08_convert(json);
}


function loadJSON(file) {
  const compressed = file.name.endsWith('c') || file.name.endsWith('.gz');
  return readFile(file, false, compressed)
    .then(data => parseJSON(data, compressed));
}


function fetchJSON(url) {
  const decoded = decodeURIComponent(url);
  const compressed = decoded.endsWith('c') || decoded.endsWith('.gz');
  return fetch(decoded)
    .then(res => compressed ? res.arrayBuffer() : res.json())
    .then(data => parseJSON(data, compressed));
}


function downloadDataFile(data, name) {
  try {
    // cannot hundle large file with dataURI scheme
    // url = 'data:application/json,' + encodeURIComponent(JSON.stringify(json))
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement('a');
    a.download = name;
    a.href = url;
    // a.click() does not work on firefox
    a.dispatchEvent(new MouseEvent('click', {
      'view': window,
      'bubbles': true,
      'cancelable': false
    }));
    // window.URL.revokeObjectURL(url) does not work on firefox
  } catch (e) {
    // no DOM (unit testing)
  }
}


function downloadJSON(json, name, compress=true) {
  const str = JSON.stringify(json);
  const data = compress ? pako.gzip(str) : str;
  const c = compress ? 'c' : 'r';
  const ext = json.hasOwnProperty('edges') ? `.gf${c}` :  `.nd${c}`;
  downloadDataFile(data, `${name}${ext}`);
}


var hfile = {
  readFile, parseJSON, loadJSON, fetchJSON,
  downloadDataFile, downloadJSON
};

/** @module helper/image */

function showPlot(vegaSpec, selector) {
  new vega.View(vega.parse(vegaSpec))
    .initialize(selector)
    .run();
}


function plotThumbnail(vegaSpec) {
  const view = new vega.View(vega.parse(vegaSpec));
  return view.toImageURL('png');  // Promise
}


var himg = {
  showPlot, plotThumbnail
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

/** @module component/Dialog */

function pickDialog(resources, callback) {
  store.getAppSetting('compoundIDPlaceholder').then(ids => {
    d3.select('#pick-queryarea').text(ids);
  });
  d3.select('#pick-submit')
    .on('click', () => {
      d3.select('#loading-icon').style('display', 'inline');
      const query = {
        type: 'chemsearch',
        targets: resources.filter(e => e.domain === 'chemical').map(e => e.id),
        key: 'compound_id',
        values: d3form.textareaLines('#pick-queryarea')
      };
      return fetcher.get('run', query)
        .then(fetcher.json)
        .then(callback, fetcher.error);
    });
}


function propDialog(resources, callback) {
  d3.select('#prop-targets')
    .call(cmp.checkboxList, resources, 'targets', d => d.id, d => d.name)
    .on('change', function () {
      const cols = KArray.from(d3form.checkboxData('#prop-targets'))
        .map(d => d.fields)
        .extend().unique('key');
      d3.select('#prop-key')
        .call(cmp.selectOptions, cols, d => d.key, d => d.name);
    });
  d3.select('#prop-submit')
    .on('click', () => {
      d3.select('#loading-circle').style('display', 'inline');
      const query = {
        type: 'chemprop',
        targets: d3form.checkboxValues('#prop-targets'),
        key: d3form.optionData('#prop-key').key,
        values: d3form.textareaLines('#prop-queryarea'),
        operator: d3form.value('#prop-operator')
      };
      return fetcher.get('async', query)
        .then(fetcher.json)
        .then(callback, fetcher.error);
    });
}


function structDialog(resources, callback) {
  d3.select('#struct-qsrc')
    .call(cmp.selectOptions, resources, d => d.id, d => d.name);
  d3.select('#struct-targets')
    .call(cmp.checkboxList, resources, 'targets', d => d.id, d => d.name);
  store.getAppSetting('rdkit').then(rdk => {
    d3.select('#struct-method').selectAll('option.rd')
      .attr('disabled', rdk ? null : 'disabled');
  });
  d3.selectAll('#struct-method,#struct-thldtype')
    .on('change', function () {
      const method = d3form.value('#struct-method');
      const thldtype = d3form.value('#struct-thldtype');
      d3.select('#struct-thld')
        .attr('disabled', ['gls', 'rdmorgan', 'rdfmcs'].includes(method) ? null : 'disabled')
        .attr('value', thldtype === 'edge' ? 15 : 0.7)
        .attr('min', thldtype === 'edge' ? 5 : 0)
        .attr('max', thldtype === 'edge' ? 999 : 1.0)
        .attr('step', thldtype === 'edge' ? 1 : 0.01);
      d3.select('#struct-thldtype')
        .attr('disabled', ['gls', 'rdmorgan', 'rdfmcs'].includes(method) ? null : 'disabled')
        .property('value', ['gls', 'rdfmcs'].includes(method) ? undefined : 'sim');
      d3.select('#struct-thldtype option.sim')
        .attr('disabled', ['gls', 'rdmorgan', 'rdfmcs'].includes(method) ? null : 'disabled');
      d3.select('#struct-thldtype option.edge')
        .attr('disabled', ['gls', 'rdfmcs'].includes(method) ? null : 'disabled');
      d3.select('#struct-options').selectAll('.gls')
        .attr('disabled', method === 'gls' ? null : 'disabled');
      d3.select('#struct-options .fmcs')
        .attr('disabled', method === 'rdfmcs' ? null : 'disabled');
    })
    .dispatch('change');
  d3.select('#struct-format')
    .on('change', function () {
      d3.select('#struct-qsrc')
        .attr('disabled', this.value === 'dbid' ? null : 'disabled');
    });
  d3.select('#struct-preview')
    .on('click', () => {
      const f = d3form.value('#struct-format');
      const query = {
        format: f,
        source: f === 'dbid' ? d3form.value('#struct-qsrc') : null,
        value: f === 'molfile'
          ? d3form.value('#struct-queryarea') : d3form.textareaLines('#struct-queryarea')[0],
      };
      return fetcher.get('strprev', query)
        .then(fetcher.text)
        .then(res => d3.select('#struct-image').html(res), fetcher.error);
    });
  d3.select('#struct-submit')
    .on('click', () => {
      const method = d3form.value('#struct-method');
      d3.select('#loading-circle').style('display', 'inline');
      const f = d3form.value('#struct-format');
      const query = {
        type: d3form.value('#struct-method'),
        targets: d3form.checkboxValues('#struct-targets'),
        queryMol: {
          format: f,
          source: f === 'dbid' ? d3form.value('#struct-qsrc') : null,
          value: f === 'molfile'
            ? d3form.value('#struct-queryarea') : d3form.textareaLines('#struct-queryarea')[0]
        },
        params: {
          measure: d3form.value('#struct-thldtype'),
          threshold: d3form.valueFloat('#struct-thld'),
          ignoreHs: d3form.checked('#struct-ignoreh'),
          diameter: method === 'gls' ? d3form.valueInt('#struct-diam') : null,
          maxTreeSize: method === 'gls' ? d3form.valueInt('#struct-tree') : null,
          molSizeCutoff: method === 'gls' ? d3form.valueInt('#struct-skip') : null,
          timeout: method === 'rdfmcs' ? d3form.valueInt('#struct-timeout') : null
        }
      };
      const command = query.type === 'exact' ? 'run' : 'async';
      return fetcher.get(command, query)
        .then(fetcher.json)
        .then(callback, fetcher.error);
    });
}


function sdfDialog(callback) {
  d3.select('#sdf-file')
    .on('change', () => {
      const reader = new FileReader();
      const file = document.getElementById('sdf-file').files[0];
      reader.onload = (e) => {
        d3.select('#sdf-cols')
          .call(cmp.checkboxList, misc.getSDFPropList(e.target.result),
                'fields', d => d, d => d
          );
      };
      // Scan only first 100mb of the file due to memory limit.
      reader.readAsText(file.slice(0, 100 * 1024 * 1024));
    });
  d3.select('#sdf-selectall')
    .on('change', () => {
      d3.select('#sdf-cols').selectAll('input')
        .property('checked', d3form.checked('#sdf-selectall'));
    });
  d3.select('#sdf-submit')
    .on('click', () => {
      d3.select('#loading-circle').style('display', 'inline');
      const params = {
        fields: d3form.checkboxValues('#sdf-cols'),
        implh: d3form.checked('#sdf-implh'),
        recalc: d3form.checked('#sdf-recalc')
      };
      const formData = new FormData();
      formData.append('contents', d3form.firstFile('#sdf-file'));
      formData.append('params', JSON.stringify(params));
      return fetcher.post('sdfin', formData)
        .then(fetcher.json)
        .then(callback, fetcher.error);
    });
}


function columnDialog(dataFields, callback) {
  const table = {
    fields: def.defaultFieldProperties([
      {key: 'name', format: 'text'},
      {key: 'visible', format: 'control'},
      {key: 'format', format: 'control'},
      {key: 'd3_format', format: 'control'}
    ])
  };
  const records = dataFields.map(e => {
    const rcd = {};
    const generalFormat = ['text', 'numeric', 'd3_format'];
    rcd.name = e.name;
    rcd.visible = selection => selection
        .classed('column-vis', true)
        .classed(`row-${e.key}`, true)
      .append('input')
        .attr('type', 'checkbox')
        .attr('value', e.key)
        .property('checked', e.visible);
    rcd.format = selection => selection
        .classed('column-format', true)
        .classed(`row-${e.key}`, true)
      .append('select')
        .call(cmp.selectOptions,
              generalFormat.includes(e.format) ? generalFormat : [e.format],
              d => d, d => d)
        .property('value', e.format)
        .attr('disabled', generalFormat.includes(e.format) ? null : 'disabled')
        .on('change', function () {
          d3.select(`.column-d3f.row-${e.key} input`)
            .attr('disabled', this.value === 'd3_format' ? null : 'disabled');
        });
    rcd.d3_format = selection => selection
        .classed('column-d3f', true)
        .classed(`row-${e.key}`, true)
      .append('input')
        .property('value', e.d3_format)
        .attr('disabled', e.format === 'd3_format' ? null : 'disabled');
    return rcd;
  });
  d3.select('#column-table')
    .call(cmp.createTable, table)
    .call(cmp.updateTableRecords, records, d => d.key);
  d3.select('#column-submit')
    .on('click', () => {
      const query = {
        visibles: d3form.checkboxValues('.column-vis'),
        formats: d3form.optionValues('.column-format'),
        d3_formats: d3form.inputValues('.column-d3f')
      };
      return store.setFieldProperties(win.URLQuery().id, query)
        .then(callback);
    });
}


// TODO:
function fieldFetchDialog(compoundIDs, dataFields, resources, callback) {
  // Prevent implicit submission
  document.getElementById('join-search')
    .addEventListener('keypress', event => {
      if (event.keyCode === 13) event.preventDefault();
    });
  const dataKeys = dataFields.map(e => e.key);
  const resourceFields = KArray.from(resources.map(e => e.fields))
    .extend().unique('key').filter(e => e.key !== 'id');
  d3.select('#join-keys')
    .call(cmp.checkboxList, resourceFields, 'keys', d => d.key, d => d.name)
    .selectAll('li')
    .each(function(d) { // disable already shown columns
      d3.select(this).selectAll('label').select('input')
        .property('checked', dataKeys.includes(d.key))
        .attr('disabled', dataKeys.includes(d.key) ? 'disabled' : null);
    });
  d3.select('#join-search')
    .on('keyup', function () {
      const match = d => fmt.partialMatch(d3form.value(this), d.name);
      d3.select('#join-keys').selectAll('li')
        .style('visibility', d => match(d) ? null : 'hidden')
        .style('position', d => match(d) ? null : 'absolute');
    });
  d3.select('#join-submit')
    .on('click', () => {
      d3.select('#loading-circle').style('display', 'inline');
      const selected = d3form.checkboxValues('#join-keys');
      const queryFieldKeys = resourceFields.map(e => e.key)
        .filter(e => !dataKeys.includes(e))
        .filter(e => selected.includes(e));
      const query = {
        type: 'fieldfilter',
        targetFields: queryFieldKeys,
        key: 'compound_id',
        values: compoundIDs
      };
      return fetcher.get('run', query)
        .then(fetcher.json)
        .then(json => callback(mapper.tableToMapping(json, 'id')),
              fetcher.error);
  });
}


function fieldFileDialog(callback) {
  // TODO: need to refactor
  d3.select('#importcol-file')
    .on('change', () => {
      const file = document.getElementById('importcol-file').files[0];
      const isCsv = file.name.split('.').pop() === 'csv';
      hfile.readFile(file).then(res => {
        const mapping = isCsv ? mapper.csvToMapping(res) : JSON.parse(res);
        const tbl = mapper.mappingToTable(mapping);
        d3.select('#importcol-preview').call(cmp.createTable, tbl)
          .call(cmp.updateTableRecords,
                tbl.records.slice(0, 5), d => d[tbl.fields[0].key]);
        // bind mapping
        d3.select('#importcol-preview').datum(mapping);
      });
    });
  d3.select('#importcol-submit')
    .on('click', () => {
      let mapping = d3.select('#importcol-preview').datum();
      d3.select('#importcol-preview').datum(null);  // unbind mapping
      // Generate thumbnails
      const plotCols = [];
      if (mapping.hasOwnProperty('field')) {
        mapping = mapper.singleToMulti(mapping);
      }
      mapping.fields.forEach((e, i) => {
        if (e.format === 'plot') {
          mapping.fields[i].format = 'image';
          plotCols.push(i);
        }
      });
      if (plotCols.length > 0) {
        const ps = [];
        Object.entries(mapping.mapping).forEach(m => {
          plotCols.forEach(e => {
            const p = himg.plotThumbnail(m[1][e])
              .then(img => {
                mapping.mapping[m[0]][e] = img;
              });
            ps.push(p);
          });
        });
        Promise.all(ps).then(() => callback(mapping));
      } else {
        callback(mapping);
      }
    });
}


function graphDialog(callback) {
  store.getAppSetting('rdkit').then(rdk => {
    d3.select('#graph-measure').selectAll('option.rd')
      .attr('disabled', rdk ? null : 'disabled');
  });
  d3.select('#graph-measure')
    .on('change', function () {
      d3.select('#graph-options').selectAll('.gls')
        .attr('disabled', this.value === 'gls' ? null : 'disabled');
      d3.select('#graph-options').selectAll('.fmcs')
        .attr('disabled', this.value === 'rdfmcs' ? null : 'disabled');
    });
  d3.select('#graph-submit')
    .on('click', () => {
      d3.select('#loading-circle').style('display', 'inline');
      const measure = d3form.value('#graph-measure');
      const params = {
        measure: measure,
        threshold: d3form.valueFloat('#graph-thld'),
        ignoreHs: d3form.checked('#graph-ignoreh'),
        diameter: measure === 'gls' ? d3form.valueInt('#graph-diam') : null,
        maxTreeSize: measure === 'gls' ? d3form.valueInt('#graph-tree') : null,
        molSizeCutoff: measure === 'gls' ? d3form.valueInt('#graph-skip') : null,
        timeout: measure === 'rdfmcs' ? d3form.valueInt('#graph-timeout') : null
      };
      callback(params);
    });
}


function graphConfigDialog(currentThld, minThld, callback) {
  d3.select('#graphconfig-thld')
    .attr('value', currentThld)
    .attr('max', 1.0)
    .attr('min', minThld);
  d3.select('#graphconfig-submit')
    .on('click', () => {
      const newThld = d3form.valueFloat('#graphconfig-thld');
      if (newThld < minThld) return;  // TODO: fool proof
      callback(newThld);
    });
}


function communityDialog(callback) {
  d3.select('#community-name').attr('value', 'comm_');
  d3.select('#community-submit')
    .on('click', () => {
      const query = {
        name: d3form.value('#community-name'),
        nulliso: d3form.checked('#community-nulliso')
      };
      callback(query);
    });
}


function importConfirmDialog(callback) {
  d3.select('#importconfirm-overwrite')
    .on('click', () => callback('overwrite'));
  d3.select('#importconfirm-keepboth')
    .on('click', () => callback('keepboth'));
  d3.select('#importconfirm-cancel')
    .on('click', () => callback('cancel'));
}


var dialog = {
  pickDialog, propDialog, structDialog, sdfDialog,
  columnDialog, fieldFetchDialog, fieldFileDialog, graphDialog,
  graphConfigDialog, communityDialog, importConfirmDialog
};

function interactiveInsert(data) {
  return store.getTable(data.id)
    .then(found => {
      if (!found) return Promise.resolve(data); // no existing table
      if (data.revision == found.revision) return Promise.reject(data.id); // same revision
      // data id conflict
      $('#importconfirm-dialog').modal('toggle');
      return new Promise(res => {
        dialog.importConfirmDialog(action => {
          if (action === 'overwrite') {
            res(data);
          }
          if (action === 'keepboth') {
            data.id = misc.uuidv4();
            res(data);
          }
        });
      });
    })
    .then(
      data => store.insertTable(data).then(() => data.id), // insert or update table
      id => {
        if (id) return Promise.resolve(id); // same revision -> call existing table
        return Promise.reject();
      }
    );
}


function fetchResults(command='update') {
  return store.getTable(win.URLQuery().id)
    .then(data => {
      if (!def.ongoing(data)) return Promise.reject();
      return data;
    })
    .then(data => {
      const query = {id: data.id, command: command};
      return fetcher.get('res', query)
        .then(fetcher.json)
        .then(store.updateTable, fetcher.error);
    }, () => Promise.resolve());
}


function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then(reg => {
        console.info('ServiceWorker registration successful with scope: ', reg.scope);
      }).catch(err => {
        console.info('ServiceWorker registration failed: ', err);
      });
  } else {
    console.info('Off-line mode is not supported');
  }
}


function loader() {
  /*
  if (document.location.protocol === "file:") {
    console.info('Off-line mode (local file)');
    store.setGlobalConfig('onLine', false);
    return Promise.resolve();
  }
  if ('onLine' in navigator) {
    if (!navigator.onLine) {
      console.info('Off-line mode (no internet connection)');
      store.setGlobalConfig('onLine', false);
      return Promise.resolve();
    }
  }*/
  const server = fetcher.get('server')
    .then(fetcher.json)
    .catch(() => null);
  const local = store.getAppSetting('serverInstance');
  return Promise.all([server, local]).then(ps => {
    const serverStatus = ps[0];
    const clientInstance = ps[1];
    if (!serverStatus) return Promise.resolve(null);
    if (!serverStatus.debugMode) {
      registerServiceWorker();
    } else {
      console.info('Off-line mode is disabled for debugging');
    }
    if (serverStatus.instance === clientInstance) {
      console.info('Resource schema is already up to date');
      return Promise.resolve(serverStatus);
    } else {
      return fetcher.get('schema')
        .then(fetcher.json)
        .then(schema => {
          console.info(`New resource schema version: ${serverStatus.instance}`);
          return Promise.all([
            store.setResources(schema.resources),
            store.setAppSetting('templates', schema.templates),
            store.setAppSetting(
              'compoundIDPlaceholder', schema.compoundIDPlaceholder),
              store.setAppSetting(
                'defaultDataType', schema.defaultDataType),
            store.setAppSetting('serverInstance', serverStatus.instance),
            store.setAppSetting('rdkit', serverStatus.rdkit)
          ])
          .then(() => Promise.resolve(serverStatus));
        }, fetcher.error);
    }
  });
}


var common = {
  interactiveInsert, fetchResults, registerServiceWorker, loader
};

function updateChem(resources) {
  const compound = win.URLQuery().compound;
  const query = {
    type: 'chemsearch',
    targets: resources.filter(e => e.domain === 'chemical').map(e => e.id),
    key: 'compound_id',
    values: [compound]
  };
  return fetcher.get('run', query)
    .then(fetcher.json)
    .then(res => {
      const rcd = res.records[0];
      d3.select('#compoundid').html(rcd.compound_id);
      d3.select('#compounddb').html(
        resources.find(e => e.id === rcd.source).name);
      d3.select('#structure').html(rcd._structure);
      const records = res.fields
        .filter(e => !['_structure', '_index', 'compound_id'].includes(e.key))
        .map(e => ({ key: e.name, value: rcd[e.key] }));
      const data = {
        fields: def.defaultFieldProperties([
          {key: 'key'}, {key: 'value'}
        ])
      };
      d3.select('#properties').call(cmp.createTable, data)
        .call(cmp.updateTableRecords, records, d => d.key);
      return rcd;
    }, fetcher.error);
}


function updateChemAliases(resources, qrcd) {
  const query = {
    type: 'exact',
    targets: resources.filter(e => e.domain === 'chemical').map(e => e.id),
    queryMol: {
      format: 'dbid',
      source: qrcd.source,
      value: qrcd.compound_id
    },
    params: {ignoreHs: true}
  };
  return fetcher.get('run', query)
    .then(fetcher.json)
    .then(res => {
      const records = res.records
        .filter(rcd => rcd.compound_id !== qrcd.compound_id || rcd.source !== qrcd.source)
        .map(rcd => {
          return {
            compound_id: `<a href="profile.html?compound=${rcd.compound_id}" target="_blank">${rcd.compound_id}</a>`,
            database: resources.find(e => e.id === rcd.source).name
          };
        });
      const data = {
        fields: def.defaultFieldProperties([
          {key: 'compound_id'}, {key: 'database'}
        ])
      };
      d3.select('#aliases').call(cmp.createTable, data)
        .call(cmp.updateTableRecords, records, d => d.compound_id);
    }, fetcher.error);
}


function updateActivities() {
  const compound = win.URLQuery().compound;
  // Prevent implicit submission
  document.getElementById('search')
    .addEventListener('keypress', event => {
      if (event.keyCode === 13) event.preventDefault();
    });
  d3.select('#search').on('keyup', function () {
    const match = obj => Object.values(obj)
      .some(e => fmt.partialMatch(d3form.value(this), e));
    d3.select('#results tbody').selectAll('tr')
      .style('visibility', d => match(d) ? null : 'hidden')
      .style('position', d => match(d) ? null : 'absolute');
  });
  const query = {
    type: 'profile',
    compound_id: compound
  };
  return fetcher.get('run', query)
    .then(fetcher.json)
    .then(res => {
      const table = {
        fields: def.defaultFieldProperties([
          {key: 'assay_id', name: 'Assay ID', format: 'text'},
          {key: 'field', name: 'Value type', format: 'text'},
          {key: '_value', name: 'value', format: 'numeric'}
        ])
      };
      d3.select('#results').call(cmp.createTable, table)
        .call(cmp.updateTableRecords, res.records, d => d._index)
        .call(cmp.addSort);
    }, fetcher.error);
}


function run() {
  return common.loader()
    .then(() => store.getResources())
    .then(rsrcs => Promise.all([
      updateChem(rsrcs).then(qrcd => updateChemAliases(rsrcs, qrcd)),
      updateActivities()
    ]));
}


var profile = {
  run
};

return profile;

})));
//# sourceMappingURL=kwprofile.js.map
