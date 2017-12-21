// https://github.com/mojaie/kiwiii Version 0.8.3. Copyright 2017 Seiji Matsuoka.
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("d3"),require("Dexie"),require("pako"),require("vega")):"function"==typeof define&&define.amd?define(["d3","Dexie","pako","vega"],t):t(e.d3,e.Dexie,e.pako,e.vega)}(this,function(e,t,n,r){"use strict";function o(e){const t={};return Object.entries(e.mapping).forEach(e=>{t[e[0]]=[e[1]]}),{created:e.created,fields:[e.field],key:e.key,mapping:t}}function s(e,t,n){return S.updateItem(e,e=>{e[t]=n,e.revision++}).catch(r=>{console.error(`Unexpected table ID: ${e}, key: ${t} or value: ${n}`),Promise.reject(r)})}function l(e,t){const n=parseFloat(e),r=parseFloat(t);return isNaN(n)||isNaN(r)?String(t).localeCompare(String(e)):r-n}function a(e,t){return String(t).localeCompare(String(e))}function i(e){const t=e.columns.map(e=>(e.format="raw",e));return{id:e.id,name:e.name,dataType:C[e.format],schemaVersion:.8,revision:0,status:j[e.status],fields:t,records:e.records,query:e.query,taskCount:e.searchCount,doneCount:e.searchDoneCount|e.searchCount,resultCount:e.recordCount,progress:100|e.progress,execTime:e.execTime,created:e.startDate|e.responseDate}}function c(e){if(e.hasOwnProperty("edges")){const t=i(e.nodes);return{nodes:t,edges:function(e,t){const n={fieldTransform:e.snapshot.fieldTransform,nodePositions:e.snapshot.nodePositions,nodeColor:{},nodeSize:{},nodeLabel:{},edge:{}};return e.snapshot.hasOwnProperty("nodeColor")?(n.nodeColor.id=e.snapshot.nodeColor.id,n.nodeColor.scale=e.snapshot.nodeColor.scale,n.nodeColor.field=t.find(t=>t.key===e.snapshot.nodeColor.column)):n.nodeColor={id:"color",field:t[0],scale:{scale:"linear",domain:[0,1],range:["black","white"],unknown:"gray"}},e.snapshot.hasOwnProperty("nodeSize")?(n.nodeSize.id=e.snapshot.nodeSize.id,n.nodeSize.scale=e.snapshot.nodeSize.scale,n.nodeSize.field=t.find(t=>t.key===e.snapshot.nodeSize.column)):n.nodeSize={id:"size",field:t[0],scale:{scale:"linear",domain:[0,1],range:[20,20],unknown:20}},e.snapshot.hasOwnProperty("nodeLabel")?(n.nodeLabel.id=e.snapshot.nodeLabel.id,n.nodeLabel.size=e.snapshot.nodeLabel.size,n.nodeLabel.text=e.snapshot.nodeLabel.text,n.nodeLabel.visible=e.snapshot.nodeLabel.visible,n.nodeLabel.scale=e.snapshot.nodeLabel.scale,n.nodeLabel.field=t.find(t=>t.key===e.snapshot.nodeLabel.column)):n.nodeLabel={id:"label",size:12,text:"index",visible:!1,field:t[0],scale:{scale:"linear",domain:[0,1],range:["black","white"],unknown:"gray"}},e.snapshot.hasOwnProperty("nodeContent")?n.nodeContent=e.snapshot.nodeContent:n.nodeContent={structure:{visible:!1}},e.snapshot.hasOwnProperty("edge")?n.edge=e.snapshot.edge:n.edge={id:"label",label:{size:10,visible:!1},visible:!0,scale:{scale:"linear",domain:[0,1],range:[5,5],unknown:5}},{id:e.id,name:e.name,dataType:C[e.format],schemaVersion:.8,revision:0,reference:{nodes:e.nodeTableId},status:j[e.status],fields:k.defaultFieldProperties([{key:"source"},{key:"target"},{key:"weight"}]),records:e.records,query:e.query,networkThreshold:e.networkThreshold,taskCount:e.searchCount,doneCount:e.searchDoneCount|e.searchCount,resultCount:e.recordCount,progress:100|e.progress,execTime:e.execTime,created:e.startDate|e.responseDate,snapshot:n}}(e.edges,t.fields)}}return i(e)}function d(e,t,n){return new Promise((r,o)=>{const s=new FileReader,l=t?e.slice(0,t):e;s.onload=(e=>r(e.target.result)),s.onerror=(e=>o(e)),n?s.readAsArrayBuffer(l):s.readAsText(l)})}function u(e,t){const r=t?n.inflate(e,{to:"string"}):e,o=JSON.parse(r);if(o.hasOwnProperty("schemaVersion"))return o;if(o.hasOwnProperty("edges")&&o.edges.hasOwnProperty("schemaVersion")){if(!o.edges.hasOwnProperty("reference")){o.edges.reference={nodes:o.edges.nodesID};const e={};o.nodes.records.forEach((t,n)=>{t.index=n,t.structure=t._structure,e[t._index]=t.index,delete t._index,delete t._structure}),o.edges.records.forEach(t=>{t.source=e[t.source],t.target=e[t.target]}),o.nodes.fields.forEach(e=>{"_index"===e.key&&(e.key="index"),"_structure"===e.key&&(e.key="structure")}),o.edges.snapshot.nodeColor.field.key="index",o.edges.snapshot.nodeLabel.field.key="index",o.edges.snapshot.nodeSize.field.key="index"}return o}return c(o)}function p(e,t){try{const n=window.URL.createObjectURL(new Blob([e])),r=document.createElement("a");r.download=t,r.href=n,r.dispatchEvent(new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1}))}catch(e){}}function f(t,n,r){const o=t.select("thead tr").selectAll("th").data(),s=t.select("tbody").selectAll("tr").data(n,r);s.exit().remove();const l=s.enter().append("tr");l.selectAll("td").data(e=>o.map(t=>e[t.key])).enter().append("td"),l.merge(s).selectAll("td").classed("align-middle",!0).html(function(e,t){if(void 0===e)return"";if("d3_format"===o[t].format)return I.formatNum(e,o[t].d3_format);if("plot"===o[t].format)return"[plot]";if("image"===o[t].format)return"[image]";if("control"!==o[t].format)return e}).each((t,n,r)=>{"control"===o[n].format&&e.select(r[n]).call(t)})}function m(){"serviceWorker"in navigator?navigator.serviceWorker.register("sw.js").then(e=>{console.info("ServiceWorker registration successful with scope: ",e.scope)}).catch(e=>{console.info("ServiceWorker registration failed: ",e)}):console.info("Off-line mode is not supported")}function h(t,n,r){t.append("a").classed("btn btn-secondary btn-sm",!0).attr("role","button").attr("href",`${r}?id=${n.id}`).attr("target","_blank").text("Open");const o=k.ongoing(n);t.insert("button").classed("btn btn-warning btn-sm",!0).attr("type","button").attr("data-toggle",o?null:"modal").attr("data-target",o?null:"#confirm-dialog").property("disabled",o?"disabled":null).text(o?"Running":"Delete").on("click",function(){e.select("#confirm-message").text(`Are you sure you want to delete ${n.name} ?`),e.select("#confirm-submit").on("click",()=>D.deleteTable(n.id).then(b))})}function g(t){const n={fields:k.defaultFieldProperties([{key:"name",format:"text"},{key:"status",format:"text"},{key:"resultCount",d3_format:"d"},{key:"action",format:"control"}])},r=t.map(e=>(e.resultCount=e.records.length,e.action=(t=>h(t,e,"datatable.html")),e));e.select("#local-tables").call(q.createTable,n).call(q.updateTableRecords,r,e=>e.id)}function y(t){const n={fields:k.defaultFieldProperties([{key:"name",format:"text"},{key:"nodes",format:"text"},{key:"status",format:"text"},{key:"resultCount",d3_format:"d"},{key:"action",format:"control"}])},r=t.map(e=>(e.nodes=e.reference.nodes,e.resultCount=e.records.length,e.action=(t=>h(t,e,"graph.html")),e));e.select("#local-graphs").call(q.createTable,n).call(q.updateTableRecords,r,e=>e.id)}function b(){return e.select("#refresh-all").on("click",()=>D.getAllTables().then(e=>Promise.all(e.map(e=>{if("running"!==e.status)return Promise.resolve();const t={id:e.id,command:"fetch"};return R.get("res",t).then(R.json).then(D.updateTable)}))).then(b)),e.select("#reset-local").on("click",()=>{e.select("#confirm-message").text("Are you sure you want to delete all local tables and reset the datastore ?"),e.select("#confirm-submit").on("click",()=>D.reset().then(b))}),E.loader().then(t=>(t&&function(t){const n={fields:k.defaultFieldProperties(t.calc.fields)};e.select("#server-calc").call(q.createTable,n).call(q.updateTableRecords,t.calc.records,e=>e.index);const r={fields:k.defaultFieldProperties([{key:"key",format:"text"},{key:"value",format:"text"}])};r.records=Object.entries(t).filter(e=>"calc"!==e[0]).map(e=>({key:e[0],value:e[1]})),e.select("#server-status").call(q.createTable,r).call(q.updateTableRecords,r.records,e=>e.index)}(t),Promise.all([D.getTablesByDataType("nodes").then(g),D.getTablesByDataType("edges").then(y)])))}e=e&&e.hasOwnProperty("default")?e.default:e,t=t&&t.hasOwnProperty("default")?t.default:t,n=n&&n.hasOwnProperty("default")?n.default:n,r=r&&r.hasOwnProperty("default")?r.default:r;var k={defaultFieldProperties:function(e){return e.map(e=>(e.hasOwnProperty("name")||(e.name=e.key),e.hasOwnProperty("visible")||(e.visible=!0),e.hasOwnProperty("d3_format")&&(e.format="d3_format"),e.hasOwnProperty("format")||(e.format="raw"),e))},sortType:function(e){return["numeric","d3_format"].includes(e)?"numeric":["text","compound_id"].includes(e)?"text":"none"},ongoing:function(e){return["running","ready"].includes(e.status)}};class v extends Array{unique(e){return this.reduce((t,n)=>(void 0===t.find(t=>t[e]===n[e])&&t.push(n),t),new v)}extend(){return this.reduce((e,t)=>(Array.prototype.push.apply(e,t),e),new v)}extendAsync(){return Promise.all(this).then(e=>e.reduce((e,t)=>(Array.prototype.push.apply(e,t),e),new v))}toArray(){return new Array(this)}toObject(){const e={};return this.forEach(t=>{e[t[0]]=t[1]}),e}}var x={URLQuery:function(){return v.from(window.location.search.substring(1).split("&")).map(e=>e.split("=")).toObject()}},w={getSDFPropList:function(e){const t=/>.*?<(\S+)>/g,n=new Set;let r;for(;null!==(r=t.exec(e));)n.add(r[1]);return Array.from(n)},uuidv4:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})}},P={singleToMulti:o,mappingToTable:function(e){const t=e.hasOwnProperty("field")?o(e):e,n={key:t.key,format:"text"};return{fields:k.defaultFieldProperties([n].concat(t.fields)),records:Object.entries(t.mapping).map(e=>{const n={};return n[t.key]=e[0],t.fields.forEach((t,r)=>{n[t.key]=e[1][r]}),n})}},tableToMapping:function(e,t,n=["index"]){const r={created:(new Date).toString(),fields:k.defaultFieldProperties(e.fields.filter(e=>e.key!==t).filter(e=>!n.includes(e.key))),key:t,mapping:{}};return e.records.forEach(e=>{r.mapping[e[t]]=r.fields.map(t=>e[t.key])}),r},csvToMapping:function(e){const t=e.split(/\n|\r|\r\n/),n=t.shift().split(","),r=n.shift(),o=new Date,s=[],l=[];n.forEach((e,t)=>{""!==e&&(s.push(t),l.push({key:e,format:"text"}))});const a={created:o.toString(),fields:k.defaultFieldProperties(l),key:r,mapping:{}};return t.forEach(e=>{const t=e.split(","),n=t.shift();a.mapping[n]=Array(s.length),s.forEach(e=>{a.mapping[n][e]=t[e]})}),a},apply:function(e,t){const n=t.hasOwnProperty("field")?o(t):t;e.records.filter(e=>n.mapping.hasOwnProperty(e[n.key])).forEach(e=>{n.fields.forEach((t,r)=>{e[t.key]=n.mapping[e[n.key]][r]})}),e.fields=k.defaultFieldProperties(v.from(e.fields).concat(n.fields).unique("key"))}};const A={app:"key",items:"id, dataType, created",resources:"id"};let T=new t("Store");T.version(1).stores(A);var S={getAppSetting:function(e){return T.app.where("key").equals(e).first().then(e=>{if(void 0!==e)return e.value})},putAppSetting:function(e,t){return T.app.put({key:e,value:t})},getResources:function(){return T.resources.toArray()},putResources:function(e){return T.resources.bulkPut(e)},getAllItems:function(){return T.items.orderBy("created").reverse().toArray()},getItemsByDataType:function(e){return T.items.where("dataType").equals(e).reverse().sortBy("created")},getItemById:function(e){return T.items.where("id").equals(e).first()},updateItem:function(e,t){return T.items.where("id").equals(e).modify(t)},deleteItem:function(e){return T.items.where("id").equals(e).delete()},putItem:function(e){return T.items.put(e)},reset:function(){return T.delete().then(()=>{(T=new t("Store")).version(1).stores(A)})}},D={getAppSetting:function(e){return S.getAppSetting(e).catch(t=>{console.error(`Unexpected key: ${e}`),Promise.reject(t)})},setAppSetting:function(e,t){return S.putAppSetting(e,t).catch(n=>{console.error(`Unexpected key: ${e} or value: ${t}`),Promise.reject(n)})},getResources:function(){return S.getResources()},setResources:function(e){return S.putResources(e).catch(t=>{console.error(`Unexpected resources: ${e}`),Promise.reject(t)})},getAllTables:function(){return S.getAllItems()},getTablesByDataType:function(e){return S.getItemsByDataType(e).catch(t=>{console.error(`Unexpected dataType: ${e}`),Promise.reject(t)})},getTable:function(e){return S.getItemById(e).catch(t=>{console.error(`Unexpected table ID: ${e}`),Promise.reject(t)})},setFieldProperties:function(e,t){return S.updateItem(e,e=>{e.fields.forEach((e,n)=>{e.visible=t.visibles.includes(e.key),e.format=t.formats[n],t.d3_formats[n]&&(e.d3_format=t.d3_formats[n])}),e.revision++}).catch(n=>{console.error(`Unexpected table ID: ${e} or updates: ${t}`),Promise.reject(n)})},joinFields:function(e,t){return S.updateItem(e,e=>{P.apply(e,t),e.revision++}).catch(n=>{console.error(`Unexpected table ID: ${e} or mapping: ${t}`),Promise.reject(n)})},updateTableAttribute:s,insertTable:function(e){return e.fields=k.defaultFieldProperties(e.fields),S.putItem(e).catch(t=>{console.error(`Unexpected data: ${e}`),Promise.reject(t)})},updateTable:function(e){return"failure"===e.status?s(e.id,"status","failure"):S.updateItem(e.id,t=>{e.fields=k.defaultFieldProperties(e.fields),Object.assign(t,e),t.revision++})},deleteTable:function(e){return S.deleteItem(e).catch(t=>{console.error(`Unexpected table ID: ${e}`),Promise.reject(t)})},reset:function(){return S.reset()}},O={value:function(t){return e.select(t).node().value},valueInt:function(t){return parseInt(e.select(t).node().value)},valueFloat:function(t){return parseFloat(e.select(t).node().value)},checked:function(t){return e.select(t).node().checked},firstFile:function(t){return e.select(t).node().files[0]},inputValues:function(t){return e.selectAll(t).selectAll("input").nodes().map(e=>e.value)},checkboxValues:function(t){return e.selectAll(t).selectAll("input:checked").nodes().map(e=>e.value)},optionValues:function(t){return e.selectAll(t).selectAll("select").nodes().map(e=>e.value)},textareaLines:function(t){return e.select(t).node().value.split("\n").filter(e=>e.length>0)},optionData:function(t){const n=e.select(t).property("selectedIndex");return e.select(t).selectAll("option").data().find((e,t)=>t===n)},checkboxData:function(t){return e.selectAll(t).selectAll("input:checked").data()}},I={formatNum:function(t,n){return void 0===t||null===t||Number.isNaN(t)?"":t==parseFloat(t)?e.format(n)(t):t},partialMatch:function(e,t){return void 0!==t&&null!==t&&""!==t&&-1!==t.toString().toUpperCase().indexOf(e.toString().toUpperCase())},numericAsc:l,numericDesc:function(e,t){return l(t,e)},textAsc:a,textDesc:function(e,t){return a(t,e)}};const j={Queued:"ready","In progress":"running",Aborting:"running",Aborted:"aborted",Completed:"done",Failure:"failure"},C={datatable:"nodes",connection:"edges"};var F={readFile:d,parseJSON:u,loadJSON:function(e){const t=e.name.endsWith("c")||e.name.endsWith(".gz");return d(e,!1,t).then(e=>u(e,t))},fetchJSON:function(e){const t=decodeURIComponent(e),n=t.endsWith("c")||t.endsWith(".gz");return fetch(t).then(e=>n?e.arrayBuffer():e.json()).then(e=>u(e,n))},downloadDataFile:p,downloadJSON:function(e,t,r=!0){const o=JSON.stringify(e),s=r?n.gzip(o):o,l=r?"c":"r";p(s,`${t}${e.hasOwnProperty("edges")?`.gf${l}`:`.nd${l}`}`)}},L={showPlot:function(e,t){new r.View(r.parse(e)).initialize(t).run()},plotThumbnail:function(e){return new r.View(r.parse(e)).toImageURL("png")}},q={selectOptions:function(e,t,n,r){const o=e.selectAll("option").data(t,n);o.exit().remove(),o.enter().append("option").merge(o).attr("value",n).text(r)},checkboxList:function(e,t,n,r,o){const s=e.selectAll("li").data(t,r);s.exit().remove();const l=s.enter().append("li").attr("class","form-check").append("label");l.append("input"),l.append("span");const a=l.merge(s.select("label")).attr("class","form-check-label");a.select("input").attr("type","checkbox").attr("class","form-check-input").attr("name",n).attr("value",r),a.select("span").text(o)},checkboxListT:function(e,t,n,r,o){const s=e.selectAll("li").data(t,r);s.exit().remove();const l=s.enter().append("li").attr("class","form-check").append("label");l.append("input"),l.append("a");const a=l.merge(s.select("label")).attr("class","form-check-label");a.select("input").attr("type","checkbox").attr("class","form-check-input").attr("name",n).attr("value",r),a.select("a").attr("data-toggle","tooltip").attr("data-placement","bottom").attr("title",e=>e.description||"No").text(o)},createTable:function(e,t){e.select("thead").size()&&e.select("thead").remove(),e.append("thead").append("tr"),e.select("tbody").size()&&e.select("tbody").remove(),e.append("tbody");const n=t.fields.filter(e=>e.visible),r=e.select("thead tr").selectAll("th").data(n,e=>e.key);r.exit().remove(),r.enter().append("th").merge(r).text(e=>e.name)},updateTableRecords:f,appendTableRows:function(e,t,n){const r=e.select("tbody").selectAll("tr").data();Array.prototype.push.apply(r,t),f(e,r,n)},addSort:function(t){t.select("thead tr").selectAll("th").filter(e=>"none"!==k.sortType(e.format)).append("span").append("a").attr("id",e=>`sort-${e.key}`).text("^v").style("display","inline-block").style("width","30px").style("text-align","center").on("click",n=>{const r="v"===e.select(`#sort-${n.key}`).text(),o="numeric"===k.sortType(n.format),s=r?o?I.numericAsc:I.textAsc:o?I.numericDesc:I.textDesc;t.select("tbody").selectAll("tr").sort((e,t)=>s(e[n.key],t[n.key])),e.select(`#sort-${n.key}`).text(r?"^":"v")})},formatNumbers:function(e){e.select("thead tr").selectAll("th").each((t,n)=>{"raw"!==t.digit&&e.select("tbody").selectAll("tr").selectAll("td").filter((e,t)=>t===n).text(e=>I.formatNum(e,t.digit))})}};const _="";var R={get:function(e,t={}){const n=Object.keys(t).length?`?query=${JSON.stringify(t)}`:"";return fetch(`${_}${e}${n}`,{credentials:"include"}).then(e=>200!==e.status?Promise.reject(new Error(e.statusText)):Promise.resolve(e))},json:function(e){return e.json()},text:function(e){return e.text()},blob:function(e){return e.blob()},post:function(e,t){return fetch(`${_}${e}`,{method:"POST",body:t,credentials:"include"}).then(e=>200!==e.status?Promise.reject(new Error(e.statusText)):Promise.resolve(e))},error:function(e){return console.error(e),null}},z={pickDialog:function(t,n){D.getAppSetting("compoundIDPlaceholder").then(t=>{e.select("#pick-queryarea").text(t)}),e.select("#pick-submit").on("click",()=>{e.select("#loading-icon").style("display","inline");const r={type:"chemsearch",targets:t.filter(e=>"chemical"===e.domain).map(e=>e.id),key:"compound_id",values:O.textareaLines("#pick-queryarea")};return R.get("run",r).then(R.json).then(n,R.error)})},propDialog:function(t,n){e.select("#prop-targets").call(q.checkboxList,t,"targets",e=>e.id,e=>e.name).on("change",function(){const t=v.from(O.checkboxData("#prop-targets")).map(e=>e.fields).extend().unique("key");e.select("#prop-key").call(q.selectOptions,t,e=>e.key,e=>e.name)}),e.select("#prop-submit").on("click",()=>{e.select("#loading-circle").style("display","inline");const t={type:"chemprop",targets:O.checkboxValues("#prop-targets"),key:O.optionData("#prop-key").key,values:O.textareaLines("#prop-queryarea"),operator:O.value("#prop-operator")};return R.get("async",t).then(R.json).then(n,R.error)})},structDialog:function(t,n){e.select("#struct-qsrc").call(q.selectOptions,t,e=>e.id,e=>e.name),e.select("#struct-targets").call(q.checkboxList,t,"targets",e=>e.id,e=>e.name),D.getAppSetting("rdkit").then(t=>{e.select("#struct-method").selectAll("option.rd").attr("disabled",t?null:"disabled")}),e.selectAll("#struct-method,#struct-thldtype").on("change",function(){const t=O.value("#struct-method"),n=O.value("#struct-thldtype");e.select("#struct-thld").attr("disabled",["gls","rdmorgan","rdfmcs"].includes(t)?null:"disabled").attr("value","edge"===n?15:.7).attr("min","edge"===n?5:0).attr("max","edge"===n?999:1).attr("step","edge"===n?1:.01),e.select("#struct-thldtype").attr("disabled",["gls","rdmorgan","rdfmcs"].includes(t)?null:"disabled").property("value",["gls","rdfmcs"].includes(t)?void 0:"sim"),e.select("#struct-thldtype option.sim").attr("disabled",["gls","rdmorgan","rdfmcs"].includes(t)?null:"disabled"),e.select("#struct-thldtype option.edge").attr("disabled",["gls","rdfmcs"].includes(t)?null:"disabled"),e.select("#struct-options").selectAll(".gls").attr("disabled","gls"===t?null:"disabled"),e.select("#struct-options .fmcs").attr("disabled","rdfmcs"===t?null:"disabled")}).dispatch("change"),e.select("#struct-format").on("change",function(){e.select("#struct-qsrc").attr("disabled","dbid"===this.value?null:"disabled")}),e.select("#struct-preview").on("click",()=>{const t=O.value("#struct-format"),n={format:t,source:"dbid"===t?O.value("#struct-qsrc"):null,value:"molfile"===t?O.value("#struct-queryarea"):O.textareaLines("#struct-queryarea")[0]};return R.get("strprev",n).then(R.text).then(t=>e.select("#struct-image").html(t),R.error)}),e.select("#struct-submit").on("click",()=>{const t=O.value("#struct-method");e.select("#loading-circle").style("display","inline");const r=O.value("#struct-format"),o={type:O.value("#struct-method"),targets:O.checkboxValues("#struct-targets"),queryMol:{format:r,source:"dbid"===r?O.value("#struct-qsrc"):null,value:"molfile"===r?O.value("#struct-queryarea"):O.textareaLines("#struct-queryarea")[0]},params:{measure:O.value("#struct-thldtype"),threshold:O.valueFloat("#struct-thld"),ignoreHs:O.checked("#struct-ignoreh"),diameter:"gls"===t?O.valueInt("#struct-diam"):null,maxTreeSize:"gls"===t?O.valueInt("#struct-tree"):null,molSizeCutoff:"gls"===t?O.valueInt("#struct-skip"):null,timeout:"rdfmcs"===t?O.valueInt("#struct-timeout"):null}},s="exact"===o.type?"run":"async";return R.get(s,o).then(R.json).then(n,R.error)})},sdfDialog:function(t){e.select("#sdf-file").on("change",()=>{const t=new FileReader,n=document.getElementById("sdf-file").files[0];t.onload=(t=>{e.select("#sdf-cols").call(q.checkboxList,w.getSDFPropList(t.target.result),"fields",e=>e,e=>e)}),t.readAsText(n.slice(0,104857600))}),e.select("#sdf-selectall").on("change",()=>{e.select("#sdf-cols").selectAll("input").property("checked",O.checked("#sdf-selectall"))}),e.select("#sdf-submit").on("click",()=>{e.select("#loading-circle").style("display","inline");const n={fields:O.checkboxValues("#sdf-cols"),implh:O.checked("#sdf-implh"),recalc:O.checked("#sdf-recalc")},r=new FormData;return r.append("contents",O.firstFile("#sdf-file")),r.append("params",JSON.stringify(n)),R.post("sdfin",r).then(R.json).then(t,R.error)})},columnDialog:function(t,n){const r={fields:k.defaultFieldProperties([{key:"name",format:"text"},{key:"visible",format:"control"},{key:"format",format:"control"},{key:"d3_format",format:"control"}])},o=t.map(t=>{const n={},r=["text","numeric","d3_format","raw","compound_id"];return n.name=t.name,n.visible=(e=>e.classed("column-vis",!0).classed(`row-${t.key}`,!0).append("input").attr("type","checkbox").attr("value",t.key).property("checked",t.visible)),n.format=(n=>n.classed("column-format",!0).classed(`row-${t.key}`,!0).append("select").call(q.selectOptions,r.includes(t.format)?r:[t.format],e=>e,e=>e).attr("disabled",r.includes(t.format)?null:"disabled").property("value",t.format).on("change",function(){e.select(`.column-d3f.row-${t.key} input`).attr("disabled","d3_format"===this.value?null:"disabled")})),n.d3_format=(e=>e.classed("column-d3f",!0).classed(`row-${t.key}`,!0).append("input").attr("size",10).attr("disabled","d3_format"===t.format?null:"disabled").property("value",t.d3_format)),n});e.select("#column-table").call(q.createTable,r).call(q.updateTableRecords,o,e=>e.key),e.select("#column-submit").on("click",()=>{const e={visibles:O.checkboxValues(".column-vis"),formats:O.optionValues(".column-format"),d3_formats:O.inputValues(".column-d3f")};return D.setFieldProperties(x.URLQuery().id,e).then(n)})},fieldFetchDialog:function(t,n,r,o){document.getElementById("join-search").addEventListener("keypress",e=>{13===e.keyCode&&e.preventDefault()});const s=n.map(e=>e.key),l=v.from(r.map(e=>e.fields)).extend().unique("key").filter(e=>"id"!==e.key);e.select("#join-keys").call(q.checkboxList,l,"keys",e=>e.key,e=>e.name).selectAll("li").each(function(t){e.select(this).selectAll("label").select("input").property("checked",s.includes(t.key)).attr("disabled",s.includes(t.key)?"disabled":null)}),e.select("#join-search").on("keyup",function(){const t=e=>I.partialMatch(O.value(this),e.name);e.select("#join-keys").selectAll("li").style("visibility",e=>t(e)?null:"hidden").style("position",e=>t(e)?null:"absolute")}),e.select("#join-submit").on("click",()=>{e.select("#loading-circle").style("display","inline");const n=O.checkboxValues("#join-keys"),r={type:"fieldfilter",targetFields:l.map(e=>e.key).filter(e=>!s.includes(e)).filter(e=>n.includes(e)),key:"compound_id",values:t};return R.get("run",r).then(R.json).then(e=>o(P.tableToMapping(e,"id")),R.error)})},fieldFileDialog:function(t){e.select("#importcol-file").on("change",()=>{const t=document.getElementById("importcol-file").files[0],n="csv"===t.name.split(".").pop();F.readFile(t).then(t=>{const r=n?P.csvToMapping(t):JSON.parse(t),o=P.mappingToTable(r);e.select("#importcol-preview").call(q.createTable,o).call(q.updateTableRecords,o.records.slice(0,5),e=>e[o.fields[0].key]),e.select("#importcol-preview").datum(r)})}),e.select("#importcol-submit").on("click",()=>{let n=e.select("#importcol-preview").datum();e.select("#importcol-preview").datum(null);const r=[];if(n.hasOwnProperty("field")&&(n=P.singleToMulti(n)),n.fields.forEach((e,t)=>{"plot"===e.format&&(n.fields[t].format="image",r.push(t))}),r.length>0){const e=[];Object.entries(n.mapping).forEach(t=>{r.forEach(r=>{const o=L.plotThumbnail(t[1][r]).then(e=>{n.mapping[t[0]][r]=e});e.push(o)})}),Promise.all(e).then(()=>t(n))}else t(n)})},graphDialog:function(t){D.getAppSetting("rdkit").then(t=>{e.select("#graph-measure").selectAll("option.rd").attr("disabled",t?null:"disabled")}),e.select("#graph-measure").on("change",function(){e.select("#graph-options").selectAll(".gls").attr("disabled","gls"===this.value?null:"disabled"),e.select("#graph-options").selectAll(".fmcs").attr("disabled","rdfmcs"===this.value?null:"disabled")}),e.select("#graph-submit").on("click",()=>{e.select("#loading-circle").style("display","inline");const n=O.value("#graph-measure"),r={measure:n,threshold:O.valueFloat("#graph-thld"),ignoreHs:O.checked("#graph-ignoreh"),diameter:"gls"===n?O.valueInt("#graph-diam"):null,maxTreeSize:"gls"===n?O.valueInt("#graph-tree"):null,molSizeCutoff:"gls"===n?O.valueInt("#graph-skip"):null,timeout:"rdfmcs"===n?O.valueInt("#graph-timeout"):null};t(r)})},graphConfigDialog:function(t,n,r){e.select("#graphconfig-thld").attr("value",t).attr("max",1).attr("min",n),e.select("#graphconfig-submit").on("click",()=>{const e=O.valueFloat("#graphconfig-thld");e<n||r(e)})},communityDialog:function(t){e.select("#community-name").attr("value","comm_"),e.select("#community-submit").on("click",()=>{const e={name:O.value("#community-name"),nulliso:O.checked("#community-nulliso")};t(e)})},importConfirmDialog:function(t){e.select("#importconfirm-overwrite").on("click",()=>t("overwrite")),e.select("#importconfirm-keepboth").on("click",()=>t("keepboth")),e.select("#importconfirm-cancel").on("click",()=>t("cancel"))}},E={interactiveInsert:function(e){return D.getTable(e.id).then(t=>t?e.revision==t.revision?Promise.reject(e.id):($("#importconfirm-dialog").modal("toggle"),new Promise(t=>{z.importConfirmDialog(n=>{"overwrite"===n&&t(e),"keepboth"===n&&(e.id=w.uuidv4(),t(e))})})):Promise.resolve(e)).then(e=>D.insertTable(e).then(()=>e.id),e=>e?Promise.resolve(e):Promise.reject())},fetchResults:function(e="update"){return D.getTable(x.URLQuery().id).then(e=>k.ongoing(e)?e:Promise.reject()).then(t=>{const n={id:t.id,command:e};return R.get("res",n).then(R.json).then(D.updateTable,R.error)},()=>Promise.resolve())},registerServiceWorker:m,loader:function(){const e=R.get("server").then(R.json).catch(()=>null),t=D.getAppSetting("serverInstance");return Promise.all([e,t]).then(e=>{const t=e[0],n=e[1];return t?(t.debugMode?console.info("Off-line mode is disabled for debugging"):m(),t.instance===n?(console.info("Resource schema is already up to date"),Promise.resolve(t)):R.get("schema").then(R.json).then(e=>(console.info(`New resource schema version: ${t.instance}`),Promise.all([D.setResources(e.resources),D.setAppSetting("templates",e.templates),D.setAppSetting("compoundIDPlaceholder",e.compoundIDPlaceholder),D.setAppSetting("defaultDataType",e.defaultDataType),D.setAppSetting("serverInstance",t.instance),D.setAppSetting("rdkit",t.rdkit)]).then(()=>Promise.resolve(t))),R.error)):Promise.resolve(null)})}};b()});
//# sourceMappingURL=kwcontrol.js.map
