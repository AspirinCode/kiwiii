// https://github.com/mojaie/kiwiii Version 0.8.1. Copyright 2017 Seiji Matsuoka.
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("d3"),require("Dexie"),require("pako"),require("vega")):"function"==typeof define&&define.amd?define(["d3","Dexie","pako","vega"],t):e.kwprofile=t(e.d3,e.Dexie,e.pako,e.vega)}(this,function(e,t,n,r){"use strict";function o(e,t){const n=parseFloat(e),r=parseFloat(t);return isNaN(n)||isNaN(r)?String(t).localeCompare(String(e)):r-n}function s(e,t){return String(t).localeCompare(String(e))}function l(e){const t={};return Object.entries(e.mapping).forEach(e=>{t[e[0]]=[e[1]]}),{created:e.created,fields:[e.field],key:e.key,mapping:t}}function a(e,t,n){return S.updateItem(e,e=>{e[t]=n,e.revision++}).catch(r=>{console.error(`Unexpected table ID: ${e}, key: ${t} or value: ${n}`),Promise.reject(r)})}function i(e){const t=e.columns.map(e=>(e.format="raw",e));return{id:e.id,name:e.name,dataType:O[e.format],schemaVersion:.8,revision:0,status:I[e.status],fields:t,records:e.records,query:e.query,taskCount:e.searchCount,doneCount:e.searchDoneCount|e.searchCount,resultCount:e.recordCount,progress:100|e.progress,execTime:e.execTime,created:e.startDate|e.responseDate}}function c(e){if(e.hasOwnProperty("edges")){const t=i(e.nodes);return{nodes:t,edges:function(e,t){const n={fieldTransform:e.snapshot.fieldTransform,nodePositions:e.snapshot.nodePositions,nodeColor:{},nodeSize:{},nodeLabel:{},edge:{}};return e.snapshot.hasOwnProperty("nodeColor")?(n.nodeColor.id=e.snapshot.nodeColor.id,n.nodeColor.scale=e.snapshot.nodeColor.scale,n.nodeColor.field=t.find(t=>t.key===e.snapshot.nodeColor.column)):n.nodeColor={id:"color",field:t[0],scale:{scale:"linear",domain:[0,1],range:["black","white"],unknown:"gray"}},e.snapshot.hasOwnProperty("nodeSize")?(n.nodeSize.id=e.snapshot.nodeSize.id,n.nodeSize.scale=e.snapshot.nodeSize.scale,n.nodeSize.field=t.find(t=>t.key===e.snapshot.nodeSize.column)):n.nodeSize={id:"size",field:t[0],scale:{scale:"linear",domain:[0,1],range:[20,20],unknown:20}},e.snapshot.hasOwnProperty("nodeLabel")?(n.nodeLabel.id=e.snapshot.nodeLabel.id,n.nodeLabel.size=e.snapshot.nodeLabel.size,n.nodeLabel.text=e.snapshot.nodeLabel.text,n.nodeLabel.visible=e.snapshot.nodeLabel.visible,n.nodeLabel.scale=e.snapshot.nodeLabel.scale,n.nodeLabel.field=t.find(t=>t.key===e.snapshot.nodeLabel.column)):n.nodeLabel={id:"label",size:12,text:"index",visible:!1,field:t[0],scale:{scale:"linear",domain:[0,1],range:["black","white"],unknown:"gray"}},e.snapshot.hasOwnProperty("nodeContent")?n.nodeContent=e.snapshot.nodeContent:n.nodeContent={structure:{visible:!1}},e.snapshot.hasOwnProperty("edge")?n.edge=e.snapshot.edge:n.edge={id:"label",label:{size:10,visible:!1},visible:!0,scale:{scale:"linear",domain:[0,1],range:[5,5],unknown:5}},{id:e.id,name:e.name,dataType:O[e.format],schemaVersion:.8,revision:0,reference:{nodes:e.nodeTableId},status:I[e.status],fields:g.defaultFieldProperties([{key:"source"},{key:"target"},{key:"weight"}]),records:e.records,query:e.query,networkThreshold:e.networkThreshold,taskCount:e.searchCount,doneCount:e.searchDoneCount|e.searchCount,resultCount:e.recordCount,progress:100|e.progress,execTime:e.execTime,created:e.startDate|e.responseDate,snapshot:n}}(e.edges,t.fields)}}return i(e)}function d(e,t,n){return new Promise((r,o)=>{const s=new FileReader,l=t?e.slice(0,t):e;s.onload=(e=>r(e.target.result)),s.onerror=(e=>o(e)),n?s.readAsArrayBuffer(l):s.readAsText(l)})}function u(e,t){const r=t?n.inflate(e,{to:"string"}):e,o=JSON.parse(r);return o.hasOwnProperty("schemaVersion")?o:o.hasOwnProperty("edges")&&o.edges.hasOwnProperty("schemaVersion")?o:c(o)}function p(e,t){try{const n=window.URL.createObjectURL(new Blob([e])),r=document.createElement("a");r.download=t,r.href=n,r.dispatchEvent(new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1}))}catch(e){}}function m(t,n,r){const o=t.select("thead tr").selectAll("th").data(),s=t.select("tbody").selectAll("tr").data(n,r);s.exit().remove();const l=s.enter().append("tr");l.selectAll("td").data(e=>o.map(t=>e[t.key])).enter().append("td"),l.merge(s).selectAll("td").classed("align-middle",!0).html(function(e,t){if(void 0===e)return"";if("d3_format"===o[t].format)return y.formatNum(e,o[t].d3_format);if("plot"===o[t].format)return"[plot]";if("image"===o[t].format)return"[image]";if("control"!==o[t].format)return e}).each((t,n,r)=>{"control"===o[n].format&&e.select(r[n]).call(t)})}function f(){"serviceWorker"in navigator?navigator.serviceWorker.register("sw.js").then(e=>{console.info("ServiceWorker registration successful with scope: ",e.scope)}).catch(e=>{console.info("ServiceWorker registration failed: ",e)}):console.info("Off-line mode is not supported")}e=e&&e.hasOwnProperty("default")?e.default:e,t=t&&t.hasOwnProperty("default")?t.default:t,n=n&&n.hasOwnProperty("default")?n.default:n,r=r&&r.hasOwnProperty("default")?r.default:r;var h={value:function(t){return e.select(t).node().value},valueInt:function(t){return parseInt(e.select(t).node().value)},valueFloat:function(t){return parseFloat(e.select(t).node().value)},checked:function(t){return e.select(t).node().checked},firstFile:function(t){return e.select(t).node().files[0]},inputValues:function(t){return e.selectAll(t).selectAll("input").nodes().map(e=>e.value)},checkboxValues:function(t){return e.selectAll(t).selectAll("input:checked").nodes().map(e=>e.value)},optionValues:function(t){return e.selectAll(t).selectAll("select").nodes().map(e=>e.value)},textareaLines:function(t){return e.select(t).node().value.split("\n").filter(e=>e.length>0)},optionData:function(t){const n=e.select(t).property("selectedIndex");return e.select(t).selectAll("option").data().find((e,t)=>t===n)},checkboxData:function(t){return e.selectAll(t).selectAll("input:checked").data()}},g={defaultFieldProperties:function(e){return e.map(e=>(e.hasOwnProperty("name")||(e.name=e.key),e.hasOwnProperty("visible")||(e.visible=!0),e.hasOwnProperty("d3_format")&&(e.format="d3_format"),e.hasOwnProperty("format")||(e.format="raw"),e))},sortType:function(e){return["numeric","d3_format"].includes(e)?"numeric":["text","compound_id"].includes(e)?"text":"none"},ongoing:function(e){return["running","ready"].includes(e.status)}},y={formatNum:function(t,n){return void 0===t||null===t||Number.isNaN(t)?"":t==parseFloat(t)?e.format(n)(t):t},partialMatch:function(e,t){return void 0!==t&&null!==t&&""!==t&&-1!==t.toString().toUpperCase().indexOf(e.toString().toUpperCase())},numericAsc:o,numericDesc:function(e,t){return o(t,e)},textAsc:s,textDesc:function(e,t){return s(t,e)}};class b extends Array{unique(e){return this.reduce((t,n)=>(void 0===t.find(t=>t[e]===n[e])&&t.push(n),t),new b)}extend(){return this.reduce((e,t)=>(Array.prototype.push.apply(e,t),e),new b)}extendAsync(){return Promise.all(this).then(e=>e.reduce((e,t)=>(Array.prototype.push.apply(e,t),e),new b))}toArray(){return new Array(this)}toObject(){const e={};return this.forEach(t=>{e[t[0]]=t[1]}),e}}var k={URLQuery:function(){return b.from(window.location.search.substring(1).split("&")).map(e=>e.split("=")).toObject()}};const v="";var x={get:function(e,t={}){const n=Object.keys(t).length?`?query=${JSON.stringify(t)}`:"";return fetch(`${v}${e}${n}`,{credentials:"include"}).then(e=>200!==e.status?Promise.reject(new Error(e.statusText)):Promise.resolve(e))},json:function(e){return e.json()},text:function(e){return e.text()},blob:function(e){return e.blob()},post:function(e,t){return fetch(`${v}${e}`,{method:"POST",body:t,credentials:"include"}).then(e=>200!==e.status?Promise.reject(new Error(e.statusText)):Promise.resolve(e))},error:function(e){return console.error(e),null}},w={getSDFPropList:function(e){const t=/>.*?<(\S+)>/g,n=new Set;let r;for(;null!==(r=t.exec(e));)n.add(r[1]);return Array.from(n)},uuidv4:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})}},P={singleToMulti:l,mappingToTable:function(e){const t=e.hasOwnProperty("field")?l(e):e,n={key:t.key,format:"text"};return{fields:g.defaultFieldProperties([n].concat(t.fields)),records:Object.entries(t.mapping).map(e=>{const n={};return n[t.key]=e[0],t.fields.forEach((t,r)=>{n[t.key]=e[1][r]}),n})}},tableToMapping:function(e,t,n=["index"]){const r={created:(new Date).toString(),fields:g.defaultFieldProperties(e.fields.filter(e=>e.key!==t).filter(e=>!n.includes(e.key))),key:t,mapping:{}};return e.records.forEach(e=>{r.mapping[e[t]]=r.fields.map(t=>e[t.key])}),r},csvToMapping:function(e){const t=e.split(/\n|\r|\r\n/),n=t.shift().split(","),r=n.shift(),o=new Date,s=[],l=[];n.forEach((e,t)=>{""!==e&&(s.push(t),l.push({key:e,format:"text"}))});const a={created:o.toString(),fields:g.defaultFieldProperties(l),key:r,mapping:{}};return t.forEach(e=>{const t=e.split(","),n=t.shift();a.mapping[n]=Array(s.length),s.forEach(e=>{a.mapping[n][e]=t[e]})}),a},apply:function(e,t){const n=t.hasOwnProperty("field")?l(t):t;e.records.filter(e=>n.mapping.hasOwnProperty(e[n.key])).forEach(e=>{n.fields.forEach((t,r)=>{e[t.key]=n.mapping[e[n.key]][r]})}),e.fields=g.defaultFieldProperties(b.from(e.fields).concat(n.fields).unique("key"))}};const A={app:"key",items:"id, dataType, created",resources:"id"};let T=new t("Store");T.version(1).stores(A);var S={getAppSetting:function(e){return T.app.where("key").equals(e).first().then(e=>{if(void 0!==e)return e.value})},putAppSetting:function(e,t){return T.app.put({key:e,value:t})},getResources:function(){return T.resources.toArray()},putResources:function(e){return T.resources.bulkPut(e)},getAllItems:function(){return T.items.orderBy("created").reverse().toArray()},getItemsByDataType:function(e){return T.items.where("dataType").equals(e).reverse().sortBy("created")},getItemById:function(e){return T.items.where("id").equals(e).first()},updateItem:function(e,t){return T.items.where("id").equals(e).modify(t)},deleteItem:function(e){return T.items.where("id").equals(e).delete()},putItem:function(e){return T.items.put(e)},reset:function(){return T.delete().then(()=>{(T=new t("Store")).version(1).stores(A)})}},D={getAppSetting:function(e){return S.getAppSetting(e).catch(t=>{console.error(`Unexpected key: ${e}`),Promise.reject(t)})},setAppSetting:function(e,t){return S.putAppSetting(e,t).catch(n=>{console.error(`Unexpected key: ${e} or value: ${t}`),Promise.reject(n)})},getResources:function(){return S.getResources()},setResources:function(e){return S.putResources(e).catch(t=>{console.error(`Unexpected resources: ${e}`),Promise.reject(t)})},getAllTables:function(){return S.getAllItems()},getTablesByDataType:function(e){return S.getItemsByDataType(e).catch(t=>{console.error(`Unexpected dataType: ${e}`),Promise.reject(t)})},getTable:function(e){return S.getItemById(e).catch(t=>{console.error(`Unexpected table ID: ${e}`),Promise.reject(t)})},setFieldProperties:function(e,t){return S.updateItem(e,e=>{e.fields.forEach((e,n)=>{e.visible=t.visibles.includes(e.key),e.format=t.formats[n],t.d3_formats[n]&&(e.d3_format=t.d3_formats[n])}),e.revision++}).catch(n=>{console.error(`Unexpected table ID: ${e} or updates: ${t}`),Promise.reject(n)})},joinFields:function(e,t){return S.updateItem(e,e=>{P.apply(e,t),e.revision++}).catch(n=>{console.error(`Unexpected table ID: ${e} or mapping: ${t}`),Promise.reject(n)})},updateTableAttribute:a,insertTable:function(e){return e.fields=g.defaultFieldProperties(e.fields),S.putItem(e).catch(t=>{console.error(`Unexpected data: ${e}`),Promise.reject(t)})},updateTable:function(e){return"failure"===e.status?a(e.id,"status","failure"):S.updateItem(e.id,t=>{e.fields=g.defaultFieldProperties(e.fields),Object.assign(t,e),t.revision++})},deleteTable:function(e){return S.deleteItem(e).catch(t=>{console.error(`Unexpected table ID: ${e}`),Promise.reject(t)})},reset:function(){return S.reset()}};const I={Queued:"ready","In progress":"running",Aborting:"running",Aborted:"aborted",Completed:"done",Failure:"failure"},O={datatable:"nodes",connection:"edges"};var j={readFile:d,parseJSON:u,loadJSON:function(e){const t=e.name.endsWith("c")||e.name.endsWith(".gz");return d(e,!1,t).then(e=>u(e,t))},fetchJSON:function(e){const t=decodeURIComponent(e),n=t.endsWith("c")||t.endsWith(".gz");return fetch(t).then(e=>n?e.arrayBuffer():e.json()).then(e=>u(e,n))},downloadDataFile:p,downloadJSON:function(e,t,r=!0){const o=JSON.stringify(e),s=r?n.gzip(o):o,l=r?"c":"r";p(s,`${t}${e.hasOwnProperty("edges")?`.gf${l}`:`.nd${l}`}`)}},_={showPlot:function(e,t){new r.View(r.parse(e)).initialize(t).run()},plotThumbnail:function(e){return new r.View(r.parse(e)).toImageURL("png")}},C={selectOptions:function(e,t,n,r){const o=e.selectAll("option").data(t,n);o.exit().remove(),o.enter().append("option").merge(o).attr("value",n).text(r)},checkboxList:function(e,t,n,r,o){const s=e.selectAll("li").data(t,r);s.exit().remove();const l=s.enter().append("li").attr("class","form-check").append("label");l.append("input"),l.append("span");const a=l.merge(s.select("label")).attr("class","form-check-label");a.select("input").attr("type","checkbox").attr("class","form-check-input").attr("name",n).attr("value",r),a.select("span").text(o)},checkboxListT:function(e,t,n,r,o){const s=e.selectAll("li").data(t,r);s.exit().remove();const l=s.enter().append("li").attr("class","form-check").append("label");l.append("input"),l.append("a");const a=l.merge(s.select("label")).attr("class","form-check-label");a.select("input").attr("type","checkbox").attr("class","form-check-input").attr("name",n).attr("value",r),a.select("a").attr("data-toggle","tooltip").attr("data-placement","bottom").attr("title",e=>e.description||"No").text(o)},createTable:function(e,t){e.select("thead").size()&&e.select("thead").remove(),e.append("thead").append("tr"),e.select("tbody").size()&&e.select("tbody").remove(),e.append("tbody");const n=t.fields.filter(e=>e.visible),r=e.select("thead tr").selectAll("th").data(n,e=>e.key);r.exit().remove(),r.enter().append("th").merge(r).text(e=>e.name)},updateTableRecords:m,appendTableRows:function(e,t,n){const r=e.select("tbody").selectAll("tr").data();Array.prototype.push.apply(r,t),m(e,r,n)},addSort:function(t){t.select("thead tr").selectAll("th").filter(e=>"none"!==g.sortType(e.format)).append("span").append("a").attr("id",e=>`sort-${e.key}`).text("^v").style("display","inline-block").style("width","30px").style("text-align","center").on("click",n=>{const r="v"===e.select(`#sort-${n.key}`).text(),o="numeric"===g.sortType(n.format),s=r?o?y.numericAsc:y.textAsc:o?y.numericDesc:y.textDesc;t.select("tbody").selectAll("tr").sort((e,t)=>s(e[n.key],t[n.key])),e.select(`#sort-${n.key}`).text(r?"^":"v")})},formatNumbers:function(e){e.select("thead tr").selectAll("th").each((t,n)=>{"raw"!==t.digit&&e.select("tbody").selectAll("tr").selectAll("td").filter((e,t)=>t===n).text(e=>y.formatNum(e,t.digit))})}},L={pickDialog:function(t,n){D.getAppSetting("compoundIDPlaceholder").then(t=>{e.select("#pick-queryarea").text(t)}),e.select("#pick-submit").on("click",()=>{e.select("#loading-icon").style("display","inline");const r={type:"chemsearch",targets:t.filter(e=>"chemical"===e.domain).map(e=>e.id),key:"compound_id",values:h.textareaLines("#pick-queryarea")};return x.get("run",r).then(x.json).then(n,x.error)})},propDialog:function(t,n){e.select("#prop-targets").call(C.checkboxList,t,"targets",e=>e.id,e=>e.name).on("change",function(){const t=b.from(h.checkboxData("#prop-targets")).map(e=>e.fields).extend().unique("key");e.select("#prop-key").call(C.selectOptions,t,e=>e.key,e=>e.name)}),e.select("#prop-submit").on("click",()=>{e.select("#loading-circle").style("display","inline");const t={type:"chemprop",targets:h.checkboxValues("#prop-targets"),key:h.optionData("#prop-key").key,values:h.textareaLines("#prop-queryarea"),operator:h.value("#prop-operator")};return x.get("async",t).then(x.json).then(n,x.error)})},structDialog:function(t,n){e.select("#struct-qsrc").call(C.selectOptions,t,e=>e.id,e=>e.name),e.select("#struct-targets").call(C.checkboxList,t,"targets",e=>e.id,e=>e.name),D.getAppSetting("rdkit").then(t=>{e.select("#struct-method").selectAll("option.rd").attr("disabled",t?null:"disabled")}),e.selectAll("#struct-method,#struct-thldtype").on("change",function(){const t=h.value("#struct-method"),n=h.value("#struct-thldtype");e.select("#struct-thld").attr("disabled",["gls","rdmorgan","rdfmcs"].includes(t)?null:"disabled").attr("value","edge"===n?15:.7).attr("min","edge"===n?5:0).attr("max","edge"===n?999:1).attr("step","edge"===n?1:.01),e.select("#struct-thldtype").attr("disabled",["gls","rdmorgan","rdfmcs"].includes(t)?null:"disabled").property("value",["gls","rdfmcs"].includes(t)?void 0:"sim"),e.select("#struct-thldtype option.sim").attr("disabled",["gls","rdmorgan","rdfmcs"].includes(t)?null:"disabled"),e.select("#struct-thldtype option.edge").attr("disabled",["gls","rdfmcs"].includes(t)?null:"disabled"),e.select("#struct-options").selectAll(".gls").attr("disabled","gls"===t?null:"disabled"),e.select("#struct-options .fmcs").attr("disabled","rdfmcs"===t?null:"disabled")}).dispatch("change"),e.select("#struct-format").on("change",function(){e.select("#struct-qsrc").attr("disabled","dbid"===this.value?null:"disabled")}),e.select("#struct-preview").on("click",()=>{const t=h.value("#struct-format"),n={format:t,source:"dbid"===t?h.value("#struct-qsrc"):null,value:"molfile"===t?h.value("#struct-queryarea"):h.textareaLines("#struct-queryarea")[0]};return x.get("strprev",n).then(x.text).then(t=>e.select("#struct-image").html(t),x.error)}),e.select("#struct-submit").on("click",()=>{const t=h.value("#struct-method");e.select("#loading-circle").style("display","inline");const r=h.value("#struct-format"),o={type:h.value("#struct-method"),targets:h.checkboxValues("#struct-targets"),queryMol:{format:r,source:"dbid"===r?h.value("#struct-qsrc"):null,value:"molfile"===r?h.value("#struct-queryarea"):h.textareaLines("#struct-queryarea")[0]},params:{measure:h.value("#struct-thldtype"),threshold:h.valueFloat("#struct-thld"),ignoreHs:h.checked("#struct-ignoreh"),diameter:"gls"===t?h.valueInt("#struct-diam"):null,maxTreeSize:"gls"===t?h.valueInt("#struct-tree"):null,molSizeCutoff:"gls"===t?h.valueInt("#struct-skip"):null,timeout:"rdfmcs"===t?h.valueInt("#struct-timeout"):null}},s="exact"===o.type?"run":"async";return x.get(s,o).then(x.json).then(n,x.error)})},sdfDialog:function(t){e.select("#sdf-file").on("change",()=>{const t=new FileReader,n=document.getElementById("sdf-file").files[0];t.onload=(t=>{e.select("#sdf-cols").call(C.checkboxList,w.getSDFPropList(t.target.result),"fields",e=>e,e=>e)}),t.readAsText(n.slice(0,104857600))}),e.select("#sdf-selectall").on("change",()=>{e.select("#sdf-cols").selectAll("input").property("checked",h.checked("#sdf-selectall"))}),e.select("#sdf-submit").on("click",()=>{e.select("#loading-circle").style("display","inline");const n={fields:h.checkboxValues("#sdf-cols"),implh:h.checked("#sdf-implh"),recalc:h.checked("#sdf-recalc")},r=new FormData;return r.append("contents",h.firstFile("#sdf-file")),r.append("params",JSON.stringify(n)),x.post("sdfin",r).then(x.json).then(t,x.error)})},columnDialog:function(t,n){const r={fields:g.defaultFieldProperties([{key:"name",format:"text"},{key:"visible",format:"control"},{key:"format",format:"control"},{key:"d3_format",format:"control"}])},o=t.map(t=>{const n={},r=["text","numeric","d3_format","raw","compound_id"];return n.name=t.name,n.visible=(e=>e.classed("column-vis",!0).classed(`row-${t.key}`,!0).append("input").attr("type","checkbox").attr("value",t.key).property("checked",t.visible)),n.format=(n=>n.classed("column-format",!0).classed(`row-${t.key}`,!0).append("select").call(C.selectOptions,r.includes(t.format)?r:[t.format],e=>e,e=>e).attr("disabled",r.includes(t.format)?null:"disabled").property("value",t.format).on("change",function(){e.select(`.column-d3f.row-${t.key} input`).attr("disabled","d3_format"===this.value?null:"disabled")})),n.d3_format=(e=>e.classed("column-d3f",!0).classed(`row-${t.key}`,!0).append("input").attr("size",10).attr("disabled","d3_format"===t.format?null:"disabled").property("value",t.d3_format)),n});e.select("#column-table").call(C.createTable,r).call(C.updateTableRecords,o,e=>e.key),e.select("#column-submit").on("click",()=>{const e={visibles:h.checkboxValues(".column-vis"),formats:h.optionValues(".column-format"),d3_formats:h.inputValues(".column-d3f")};return D.setFieldProperties(k.URLQuery().id,e).then(n)})},fieldFetchDialog:function(t,n,r,o){document.getElementById("join-search").addEventListener("keypress",e=>{13===e.keyCode&&e.preventDefault()});const s=n.map(e=>e.key),l=b.from(r.map(e=>e.fields)).extend().unique("key").filter(e=>"id"!==e.key);e.select("#join-keys").call(C.checkboxList,l,"keys",e=>e.key,e=>e.name).selectAll("li").each(function(t){e.select(this).selectAll("label").select("input").property("checked",s.includes(t.key)).attr("disabled",s.includes(t.key)?"disabled":null)}),e.select("#join-search").on("keyup",function(){const t=e=>y.partialMatch(h.value(this),e.name);e.select("#join-keys").selectAll("li").style("visibility",e=>t(e)?null:"hidden").style("position",e=>t(e)?null:"absolute")}),e.select("#join-submit").on("click",()=>{e.select("#loading-circle").style("display","inline");const n=h.checkboxValues("#join-keys"),r={type:"fieldfilter",targetFields:l.map(e=>e.key).filter(e=>!s.includes(e)).filter(e=>n.includes(e)),key:"compound_id",values:t};return x.get("run",r).then(x.json).then(e=>o(P.tableToMapping(e,"id")),x.error)})},fieldFileDialog:function(t){e.select("#importcol-file").on("change",()=>{const t=document.getElementById("importcol-file").files[0],n="csv"===t.name.split(".").pop();j.readFile(t).then(t=>{const r=n?P.csvToMapping(t):JSON.parse(t),o=P.mappingToTable(r);e.select("#importcol-preview").call(C.createTable,o).call(C.updateTableRecords,o.records.slice(0,5),e=>e[o.fields[0].key]),e.select("#importcol-preview").datum(r)})}),e.select("#importcol-submit").on("click",()=>{let n=e.select("#importcol-preview").datum();e.select("#importcol-preview").datum(null);const r=[];if(n.hasOwnProperty("field")&&(n=P.singleToMulti(n)),n.fields.forEach((e,t)=>{"plot"===e.format&&(n.fields[t].format="image",r.push(t))}),r.length>0){const e=[];Object.entries(n.mapping).forEach(t=>{r.forEach(r=>{const o=_.plotThumbnail(t[1][r]).then(e=>{n.mapping[t[0]][r]=e});e.push(o)})}),Promise.all(e).then(()=>t(n))}else t(n)})},graphDialog:function(t){D.getAppSetting("rdkit").then(t=>{e.select("#graph-measure").selectAll("option.rd").attr("disabled",t?null:"disabled")}),e.select("#graph-measure").on("change",function(){e.select("#graph-options").selectAll(".gls").attr("disabled","gls"===this.value?null:"disabled"),e.select("#graph-options").selectAll(".fmcs").attr("disabled","rdfmcs"===this.value?null:"disabled")}),e.select("#graph-submit").on("click",()=>{e.select("#loading-circle").style("display","inline");const n=h.value("#graph-measure"),r={measure:n,threshold:h.valueFloat("#graph-thld"),ignoreHs:h.checked("#graph-ignoreh"),diameter:"gls"===n?h.valueInt("#graph-diam"):null,maxTreeSize:"gls"===n?h.valueInt("#graph-tree"):null,molSizeCutoff:"gls"===n?h.valueInt("#graph-skip"):null,timeout:"rdfmcs"===n?h.valueInt("#graph-timeout"):null};t(r)})},graphConfigDialog:function(t,n,r){e.select("#graphconfig-thld").attr("value",t).attr("max",1).attr("min",n),e.select("#graphconfig-submit").on("click",()=>{const e=h.valueFloat("#graphconfig-thld");e<n||r(e)})},communityDialog:function(t){e.select("#community-name").attr("value","comm_"),e.select("#community-submit").on("click",()=>{const e={name:h.value("#community-name"),nulliso:h.checked("#community-nulliso")};t(e)})},importConfirmDialog:function(t){e.select("#importconfirm-overwrite").on("click",()=>t("overwrite")),e.select("#importconfirm-keepboth").on("click",()=>t("keepboth")),e.select("#importconfirm-cancel").on("click",()=>t("cancel"))}},F={interactiveInsert:function(e){return D.getTable(e.id).then(t=>t?e.revision==t.revision?Promise.reject(e.id):($("#importconfirm-dialog").modal("toggle"),new Promise(t=>{L.importConfirmDialog(n=>{"overwrite"===n&&t(e),"keepboth"===n&&(e.id=w.uuidv4(),t(e))})})):Promise.resolve(e)).then(e=>D.insertTable(e).then(()=>e.id),e=>e?Promise.resolve(e):Promise.reject())},fetchResults:function(e="update"){return D.getTable(k.URLQuery().id).then(e=>g.ongoing(e)?e:Promise.reject()).then(t=>{const n={id:t.id,command:e};return x.get("res",n).then(x.json).then(D.updateTable,x.error)},()=>Promise.resolve())},registerServiceWorker:f,loader:function(){const e=x.get("server").then(x.json).catch(()=>null),t=D.getAppSetting("serverInstance");return Promise.all([e,t]).then(e=>{const t=e[0],n=e[1];return t?(t.debugMode?console.info("Off-line mode is disabled for debugging"):f(),t.instance===n?(console.info("Resource schema is already up to date"),Promise.resolve(t)):x.get("schema").then(x.json).then(e=>(console.info(`New resource schema version: ${t.instance}`),Promise.all([D.setResources(e.resources),D.setAppSetting("templates",e.templates),D.setAppSetting("compoundIDPlaceholder",e.compoundIDPlaceholder),D.setAppSetting("defaultDataType",e.defaultDataType),D.setAppSetting("serverInstance",t.instance),D.setAppSetting("rdkit",t.rdkit)]).then(()=>Promise.resolve(t))),x.error)):Promise.resolve(null)})}};return{run:function(){return F.loader().then(()=>D.getResources()).then(t=>Promise.all([function(t){const n=k.URLQuery().compound;e.select("title").text(n);const r={type:"chemsearch",targets:t.filter(e=>"chemical"===e.domain).map(e=>e.id),key:"compound_id",values:[n]};return x.get("run",r).then(x.json).then(n=>{const r=n.records[0];e.select("#compoundid").html(r.compound_id),e.select("#compounddb").html(t.find(e=>e.id===r.__source).name),e.select("#structure").html(r.structure);const o=n.fields.filter(e=>!["structure","index","compound_id"].includes(e.key)).map(e=>({key:e.name,value:r[e.key]})),s={fields:g.defaultFieldProperties([{key:"key"},{key:"value"}])};return e.select("#properties").call(C.createTable,s).call(C.updateTableRecords,o,e=>e.key),r},x.error)}(t).then(n=>(function(t,n){const r={type:"exact",targets:t.filter(e=>"chemical"===e.domain).map(e=>e.id),queryMol:{format:"dbid",source:n.__source,value:n.compound_id},params:{ignoreHs:!0}};return x.get("run",r).then(x.json).then(r=>{const o=r.records.filter(e=>e.compound_id!==n.compound_id||e.__source!==n.__source).map(e=>({compound_id:`<a href="profile.html?compound=${e.compound_id}" target="_blank">${e.compound_id}</a>`,database:t.find(t=>t.id===e.__source).name})),s={fields:g.defaultFieldProperties([{key:"compound_id"},{key:"database"}])};e.select("#aliases").call(C.createTable,s).call(C.updateTableRecords,o,e=>e.compound_id)},x.error)})(t,n)),function(){const t=k.URLQuery().compound;document.getElementById("search").addEventListener("keypress",e=>{13===e.keyCode&&e.preventDefault()}),e.select("#search").on("keyup",function(){const t=e=>Object.values(e).some(e=>y.partialMatch(h.value(this),e));e.select("#results tbody").selectAll("tr").style("visibility",e=>t(e)?null:"hidden").style("position",e=>t(e)?null:"absolute")});const n={type:"profile",compound_id:t};return x.get("run",n).then(x.json).then(t=>{const n={fields:g.defaultFieldProperties([{key:"assay_id",name:"Assay ID",format:"text"},{key:"value_type",name:"Value type",format:"text"},{key:"value",name:"Value",format:"numeric"}])};e.select("#results").call(C.createTable,n).call(C.updateTableRecords,t.records,e=>e.index).call(C.addSort)},x.error)}()]))}}});
//# sourceMappingURL=kwprofile.js.map
