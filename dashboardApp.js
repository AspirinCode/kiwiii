// https://github.com/mojaie/kiwiii Version 0.14.0. Copyright 2018 Seiji Matsuoka.
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("d3"),require("lodash"),require("Dexie"),require("pako")):"function"==typeof define&&define.amd?define(["d3","lodash","Dexie","pako"],t):e.dashboardApp=t(e.d3,e._,e.Dexie,e.pako)}(this,function(e,t,a,l){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e,t=t&&t.hasOwnProperty("default")?t.default:t,a=a&&a.hasOwnProperty("default")?a.default:a,l=l&&l.hasOwnProperty("default")?l.default:l;var s={defaultFieldProperties:function(e){return e.map(e=>(e.hasOwnProperty("name")||(e.name=e.key),e.hasOwnProperty("visible")||(e.visible=!0),e.hasOwnProperty("d3_format")&&(e.format="d3_format"),e.hasOwnProperty("format")||(e.format="raw"),e))},sortType:function(e){return["numeric","d3_format"].includes(e)?"numeric":["text","compound_id","assay_id","list"].includes(e)?"text":"none"},formatNum:function(t,a){return null==t||Number.isNaN(t)?"":t==parseFloat(t)?e.format(a)(t):t},partialMatch:function(e,t){return null!=t&&""!==t&&-1!==t.toString().toUpperCase().indexOf(e.toString().toUpperCase())},URLQuery:function(){const e=window.location.search.substring(1).split("&").map(e=>e.split("="));return t.fromPairs(e)},uuidv4:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})}};const n={items:"storeID, dataType, created"};let o=new a("Store");o.version(1).stores(n);var r={getAllItems:function(){return o.items.orderBy("created").reverse().toArray()},getItemsByDataType:function(e){return o.items.where("dataType").equals(e).reverse().sortBy("created").catch(t=>{console.error(`IDBError: Unexpected dataType: ${e}`,t)})},getItemByID:function(e){return o.items.where("storeID").equals(e).first().catch(t=>{console.error(`IDBError: Unexpected table ID: ${e}`,t)})},deleteItem:function(e){return o.items.where("storeID").equals(e).delete()},putItem:function(e){return e.storeID||(e.storeID=s.uuidv4()),o.items.put(e)},updateItem:function(e,t){return o.items.where("storeID").equals(e).modify(t).catch(e=>{console.error("IDBError: Update failed",e)})},reset:function(){return o.delete().then(()=>{(o=new a("Store")).version(1).stores(n)})}};const c="";var d={get:function(e,t={}){const a=Object.keys(t).length?`?query=${JSON.stringify(t)}`:"";return fetch(`${c}${e}${a}`,{credentials:"include"}).then(e=>200!==e.status?Promise.reject(new Error(e.statusText)):Promise.resolve(e))},json:function(e){return e.json()},text:function(e){return e.text()},blob:function(e){return e.blob()},post:function(e,t){return fetch(`${c}${e}`,{method:"POST",body:t,credentials:"include"}).then(e=>200!==e.status?Promise.reject(new Error(e.statusText)):Promise.resolve(e))},error:function(e){return console.error(e),null}};var i={serverStatus:function(){const e={};return d.get("server").then(d.json).then(t=>{e.server=t}).then(()=>d.get("schema")).then(d.json).then(t=>{e.schema=t}).catch(()=>{console.info("Server did not respond"),e.server={},e.schema={resources:[],templates:[],compoundIDPlaceholder:null}}).then(()=>e)},fetchProgress:function(e,t="update"){return r.getItemByID(e).then(a=>{if(!a)return Promise.reject(`Store: ${e} is not available`);if(!["ready","running"].includes(a.status))return;const l={id:a.reference.workflow,command:t};return d.get("progress",l).then(d.json).then(t=>"failure"===t.status?r.updateItem(e,e=>{e.status="failure"}):r.updateItem(e,e=>{e.status=t.status,e.progress=t.progress,e.execTime=t.execTime,e.fields=s.defaultFieldProperties(t.fields),e.records=t.records}))})}};function p(e,t,a){return new Promise((l,s)=>{const n=new FileReader,o=t?e.slice(0,t):e;n.onload=(e=>l(e.target.result)),n.onerror=(e=>s(e)),a?n.readAsArrayBuffer(o):n.readAsText(o)})}function u(e,t){const a=t?l.inflate(e,{to:"string"}):e;return JSON.parse(a)}function m(e,t){try{const a=window.URL.createObjectURL(new Blob([e])),l=document.createElement("a");l.download=t,l.href=a,l.dispatchEvent(new MouseEvent("click",{view:window,bubbles:!0,cancelable:!1}))}catch(e){}}var f={readFile:p,parseJSON:u,loadJSON:function(e){const t=e.name.endsWith("c")||e.name.endsWith(".gz");return p(e,!1,t).then(e=>u(e,t))},fetchJSON:function(e){const t=decodeURIComponent(e),a=t.endsWith("c")||t.endsWith(".gz");return fetch(t).then(e=>a?e.arrayBuffer():e.json()).then(e=>u(e,a))},downloadDataFile:m,downloadJSON:function(e,t,a=!0){const s=JSON.stringify(e),n=a?"c":"r";m(a?l.gzip(s):s,`${t}${e.hasOwnProperty("edges")?`.gf${n}`:`.nd${n}`}`)}};var y={buttonBox:function(e,t,a,l){e.classed("form-group",!0).classed("mb-1",!0).append("button").classed("btn",!0).classed(`btn-${l}`,!0).classed("btn-sm",!0).attr("id",t).text(a)},menuButton:function(e,t,a,l){e.classed("btn",!0).classed(`btn-${a}`,!0).classed("btn-sm",!0).classed("mr-1",!0).attr("id",l).text(t)},menuButtonLink:function(e,t,a,l,s){e.classed("btn",!0).classed(`btn-${a}`,!0).classed("btn-sm",!0).classed("mr-1",!0).attr("role","button").attr("href","#").attr("id",s),e.append("img").attr("src",l?`./assets/icon/${l}.svg`:null).style("width","1.25rem").style("height","1.25rem"),e.append("span").style("vertical-align","middle").text(t)},menuModalLink:function(e,t,a,l,s,n){e.classed("btn",!0).classed(`btn-${l}`,!0).classed("btn-sm",!0).classed("mr-1",!0).attr("id",n).attr("href","#").attr("role","button").attr("data-toggle","modal").attr("data-target",`#${t}`),e.append("img").attr("src",s?`./assets/icon/${s}.svg`:null).style("width","1.25rem").style("height","1.25rem"),e.append("span").classed("label",!0).style("vertical-align","middle").text(a)},dropdownMenuButton:function(e,t,a,l,s){e.classed("btn-group",!0).classed("mr-1",!0).attr("id",s);const n=e.append("button").classed("btn",!0).classed(`btn-${a}`,!0).classed("btn-sm",!0).classed("dropdown-toggle",!0).attr("data-toggle","dropdown");n.append("img").attr("src",l?`./assets/icon/${l}.svg`:null).style("width","1.25rem").style("height","1.25rem"),n.append("span").style("vertical-align","middle").text(t),e.append("div").classed("dropdown-menu",!0)},dropdownMenuItem:function(e,t,a,l){e.classed("dropdown-item",!0).attr("id",l).attr("href","#"),e.append("img").attr("src",a?`./assets/icon/${a}.svg`:null).classed("mr-1",!0).style("width","2rem").style("height","2rem"),e.append("span").text(t)},dropdownMenuModal:function(e,t,a,l,s){e.classed("dropdown-item",!0).attr("id",s).attr("href","#").attr("data-toggle","modal").attr("data-target",`#${a}`),e.append("img").attr("src",`./assets/icon/${l}.svg`).classed("mr-1",!0).style("width","2rem").style("height","2rem"),e.append("span").text(t)},dropdownMenuFile:function(t,a,l,s,n){t.classed("dropdown-item",!0).attr("id",n).attr("href","#").on("click",function(){e.select(this).select("input").node().click()}),t.append("form").style("display","none").append("input").attr("type","file").attr("accept",l),t.append("img").attr("src",`./assets/icon/${s}.svg`).classed("mr-1",!0).style("width","2rem").style("height","2rem"),t.append("span").text(a)},dropdownMenuFileValue:function(e){return e.select("input").node().files[0]}};function h(e,t,a){const l=e.select("thead tr").selectAll("th").data(t);l.exit().remove(),l.enter().append("th").text(e=>e.name),a&&e.call(x,a,e=>e.key,function(e){return(t,a)=>{e.forEach(e=>{const l=a[e.key],n=t.append("td").classed("align-middle",!0);void 0!==l&&("d3_format"===e.format?n.text(s.formatNum(l,e.d3_format)):"plot"===e.format?n.text("[plot]"):"image"===e.format?n.text("[image]"):"control"===e.format?n.call(l):n.text(l))})}}(t))}function x(t,a,l,s){const n=t.select("tbody").selectAll("tr").data(a,l);n.exit().remove(),n.enter().append("tr").merge(n).each(function(t){e.select(this).selectAll("td").remove(),e.select(this).call(s,t)})}var b={render:function(e,t,a,l,s){e.classed("table",!0).classed("table-striped",!0).classed("table-hover",!0).attr("id",t),a&&e.append("caption").text(a),e.append("thead").append("tr"),e.append("tbody"),l&&e.call(h,l,s)},updateHeader:h,updateContents:x};function g(e,t){e.classed("modal",!0).attr("tabindex",-1).attr("role","dialog").attr("aria-labelledby","").attr("aria-hidden",!0).attr("id",t),e.select(".modal-dialog").remove(),e.append("div").classed("modal-dialog",!0).attr("role","document").append("div").classed("modal-content",!0)}var v={confirmDialog:function(t,a,l){const s=t.call(g,a).select(".modal-content");s.append("div").classed("modal-body",!0).append("div").classed("message",!0).text(l);const n=s.append("div").classed("modal-footer",!0);n.append("button").classed("btn",!0).classed("btn-outline-secondary",!0).classed("cancel",!0).attr("type","button").attr("data-dismiss","modal").text("Cancel"),n.append("button").classed("btn",!0).classed("btn-warning",!0).classed("ok",!0).attr("type","button").attr("data-dismiss","modal").attr("data-target",`${a}-submit`).text("OK").on("click",()=>{e.select("#loading-icon").style("display","inline"),t.dispatch("submit")})},submitDialog:function(t,a,l){const s=t.call(g,a).select(".modal-content"),n=s.append("div").classed("modal-header",!0);n.append("h4").classed("modal-title",!0).text(l),n.append("button").attr("type","button").attr("data-dismiss","modal").attr("aria-label","Close").classed("close",!0).append("span").attr("aria-hidden",!0).html("&times;"),s.append("div").classed("modal-body",!0),s.append("div").classed("modal-footer",!0).append("button").classed("btn",!0).classed("btn-primary",!0).classed("submit",!0).attr("type","button").attr("data-dismiss","modal").attr("data-target",`${a}-submit`).text("Submit").on("click",()=>{e.select("#loading-icon").style("display","inline"),t.dispatch("submit")})}};function k(e,t){e.select("input").property("value",t)}function w(e,t){e.select("textarea").property("value",t)}function B(e,t){e.select("input").property("checked",t)}function D(e,t){e.select("input").property("value",t)}function I(e,t){e.select("input").property("value",t)}var S={textBox:function(e,t,a,l,s){e.classed("form-group",!0).classed("form-row",!0).classed("align-items-center",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(a),e.append("input").classed("form-control",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("id",t).attr("type","text").attr("size",l),e.call(k,s)},updateTextBox:k,textBoxValue:function(e){return e.select("input").property("value")},readonlyBox:function(e,t,a,l){e.classed("form-group",!0).classed("form-row",!0).classed("align-items-center",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(a),e.append("input").classed("form-control-plaintext",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("id",t).attr("type","text").property("readonly",!0),e.call(k,l)},textareaBox:function(e,t,a,l,s,n){e.classed("form-group",!0).classed("form-row",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(a),e.append("textarea").classed("form-control",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("rows",l).attr("placeholder",s).attr("id",t),e.call(w,n)},updateTextareaBox:w,textareaBoxValue:function(e){const t=e.select("textarea").property("value");if(t)return t;const a=e.select("textarea").attr("placeholder");return a||""},textareaBoxLines:function(e){const t=e.select("textarea").property("value");if(t)return t.split("\n").filter(e=>e.length>0);const a=e.select("textarea").attr("placeholder");return a?a.split("\n").filter(e=>e.length>0):[]},checkBox:function(e,t,a,l){const s=e.classed("form-group",!0).classed("form-row",!0).classed("form-check",!0).append("label").classed("form-check-label",!0).classed("col-form-label-sm",!0);s.append("input").classed("form-check-input",!0).attr("type","checkbox").attr("id",t),s.append("span").text(a),e.call(B,l)},updateCheckBox:B,checkBoxValue:function(e){return e.select("input").property("checked")},numberBox:function(e,t,a,l,s,n,o){e.classed("form-group",!0).classed("form-row",!0).classed("align-items-center",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(a),e.append("input").classed("form-control",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("id",t).attr("type","number").attr("min",l).attr("max",s).attr("step",n),e.call(D,o)},updateNumberBox:D,numberBoxValue:function(e){return e.select("input").property("value")},colorBox:function(t,a,l){t.classed("form-row",!0).classed("align-items-center",!0),t.append("div").classed("form-group",!0).classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).classed("mb-1",!0).text(a),t.append("div").classed("form-group",!0).classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).classed("mb-1",!0).append("input").classed("form-control",!0).classed("form-control-sm",!0).attr("type","color"),t.call(I,l).on("change",()=>{e.event.stopPropagation()})},updateColorBox:I,colorBoxValue:function(e){return e.select("input").property("value")},fileInputBox:function(e,t,a,l){e.classed("form-group",!0).classed("form-row",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(a),e.append("input").classed("form-control",!0).classed("form-control-sm",!0).classed("form-control-file",!0).classed("col-8",!0).attr("type","file").attr("accept",l).attr("id",t)},fileInputBoxValue:function(e){return e.select("input").property("files")[0]}};const M="search-dialog",V="Search by compound ID";var q={menuLink:function(e){e.call(y.dropdownMenuModal,V,M,"searchtext")},body:function(e,t){e.call(v.submitDialog,M,V).select(".modal-body").append("div").classed("ids",!0).call(S.textareaBox,"search-query","Query",20,t,"")},query:function(e,t){return{workflow:"search",targets:t,key:"compound_id",values:S.textareaBoxLines(e.select(".ids"))}}};function O(e,t){const a=e.select("select").selectAll("option").data(t,e=>e.key);a.exit().remove(),a.enter().append("option").attr("value",e=>e.key).text(e=>e.name)}function P(e,t){e.select("select").property("value",t)}function F(e,t){const a=e.select("ul").selectAll("li").data(t,e=>e.key);a.exit().remove();const l=a.enter().append("li").attr("class","form-check").append("label").attr("class","form-check-label");l.append("input").attr("type","checkbox").attr("class","form-check-input").property("value",e=>e.key),l.append("span").text(e=>e.name)}function L(t,a){a&&t.selectAll("input").each(function(t){e.select(this).property("checked",a.includes(t.key))})}var A={selectBox:function(e,t,a,l,s){e.classed("form-group",!0).classed("form-row",!0).classed("align-items-center",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(a),e.append("select").classed("form-control",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("id",t),l&&(e.call(O,l),e.call(P,s))},selectBoxItems:O,updateSelectBox:P,selectBoxValue:function(e){return e.select("select").property("value")},checklistBox:function(e,t,a,l,s){e.classed("form-group",!0).classed("form-row",!0).classed("align-items-center",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).text(a),e.append("ul").classed("form-control",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("id",t),l&&(e.call(F,l),e.call(L,s))},checklistBoxItems:F,updateChecklistBox:L,checklistBoxValue:function(e){return e.selectAll("input:checked").data().map(e=>e.key)}};function j(t){t.select(".format").on("change",function(){const a=A.selectBoxValue(e.select(this));t.select(".source").select("select").property("disabled","dbid"!==a),t.select(".textquery").property("hidden","dbid"!==a),t.select(".areaquery").property("hidden","molfile"!==a)}).dispatch("change"),t.select(".preview").on("click",function(){const a=N(t);return d.get("strprev",a).then(d.text).then(t=>e.select("#previmg").html(t),d.error)})}function N(e){const t=A.selectBoxValue(e.select(".format")),a=A.selectBoxValue(e.select(".source")),l=S.textBoxValue(e.select(".textquery")),s=S.textareaBoxLines(e.select(".areaquery"));return{format:t,source:"dbid"===t?a:null,value:"molfile"===t?s:l}}var T={queryMolGroup:function(e,t,a){e.classed("mb-3",!0),e.append("div").classed("format",!0).classed("mb-1",!0).call(A.selectBox,`${t}-format`,"Format",[{key:"molfile",name:"MDL Molfile"},{key:"dbid",name:"Compound ID"}],"molfile");const l=a.map(e=>({key:e.id,name:e.name}));e.append("div").classed("source",!0).classed("mb-1",!0).call(A.selectBox,`${t}-source`,"Source",l,null),e.append("div").classed("textquery",!0).classed("mb-1",!0).call(S.textBox,`${t}-textquery`,"Query",null,""),e.append("div").classed("areaquery",!0).classed("mb-1",!0).call(S.textareaBox,`${t}-areaquery`,"Query",6,null,""),$(function(){$('[data-toggle="popover"]').popover({html:!0,trigger:"focus"})}),e.append("div").classed("form-row",!0).classed("justify-content-end",!0).append("button").classed("preview",!0).attr("data-toggle","popover").attr("data-html","true").attr("data-content",'<div id="previmg"></div>').call(y.menuButton,"Structure preview","primary"),e.call(j)},updateQueryMolGroup:j,queryMolGroupValue:N,simOptionGroup:function(e,t){e.classed("mb-3",!0).append("p").append("button").classed("btn",!0).classed("btn-sm",!0).classed("btn-outline-primary",!0).classed("dropdown-toggle",!0).attr("data-toggle","collapse").attr("data-target",`#${t}-collapse`).attr("aria-expanded","false").attr("aria-controls",`${t}-collapse`).text("Optional parameters");const a=e.append("div").classed("collapse",!0).attr("id",`${t}-collapse`).append("div").classed("card",!0).classed("card-body",!0);a.append("div").classed("ignoreh",!0).classed("mb-1",!0).call(S.checkBox,`${t}-ignoreh`,"Ignore explicit hydrogens",!0),a.append("div").classed("timeout",!0).classed("mb-1",!0).call(S.numberBox,`${t}-timeout`,"Timeout",1,999,1,2),a.append("div").classed("diam",!0).classed("mb-1",!0).call(S.numberBox,`${t}-diam`,"Diameter (MCS-DR/GLS)",4,999,1,8),a.append("div").classed("tree",!0).classed("mb-1",!0).call(S.numberBox,`${t}-tree`,"Max tree size (MCS-DR/GLS)",20,999,1,40),a.selectAll("label.col-form-label").classed("col-4",!1).classed("col-6",!0),a.selectAll("input.form-control").classed("col-8",!1).classed("col-6",!0)},simOptionGroupValue:function(e){const t=e.select(".timeout"),a=e.select(".diam"),l=e.select(".tree"),s={ignoreHs:S.checkBoxValue(e.select(".ignoreh"))};return t.select("input").property("disabled")||(s.timeout=S.numberBoxValue(t)),a.select("input").property("disabled")||(s.diameter=S.numberBoxValue(a)),l.select("input").property("disabled")||(s.maxTreeSize=S.numberBoxValue(l)),s}};const C="struct-dialog",_="Search by structure";var R={menuLink:function(e){e.call(y.dropdownMenuModal,_,C,"searchchem")},body:function(t,a,l){const s=t.call(v.submitDialog,C,_);s.select(".modal-body").append("div").classed("qmol",!0).call(T.queryMolGroup,"struct",a,null);const n=[{key:"exact",name:"Exact match"},{key:"substr",name:"Substructure"},{key:"supstr",name:"Superstructure"},{key:"gls",name:"MCS-DR/GLS"}];l&&(n.push({key:"rdmorgan",name:"RDKit Morgan similarity"}),n.push({key:"rdfmcs",name:"RDKit FMCS"})),s.select(".modal-body").append("div").classed("method",!0).call(A.selectBox,"struct-method","Method",n,"exact"),s.select(".modal-body").append("div").classed("measure",!0).call(A.selectBox,"struct-measure","Measure",[{key:"sim",name:"Similarity"},{key:"edge",name:"Edge count"}],"sim"),s.select(".modal-body").append("div").classed("thld",!0).call(S.numberBox,"struct-thld","Threshold",.5,1,.01,.5),s.select(".modal-body").append("div").classed("option",!0).call(T.simOptionGroup,"struct");const o=a.map(e=>({key:e.id,name:e.name}));s.select(".modal-body").append("div").classed("target",!0).call(A.checklistBox,"struct-target","Target databases",o,null),s.select(".method").on("change",function(){const t=A.selectBoxValue(e.select(this)),a=["gls","rdfmcs"].includes(t);s.select(".measure").select("select").property("value",a?void 0:"sim").property("disabled",!a),s.selectAll(".thld").select("input").property("disabled",["exact","substr","supstr"].includes(t)),s.selectAll(".diam, .tree").select("input").property("disabled","gls"!==t),s.select(".timeout").select("input").property("disabled",!a)}).dispatch("change")},query:function(e){const t=T.simOptionGroupValue(e.select(".option")),a=e.select(".measure"),l=e.select(".thld");return a.select("select").property("disabled")||(t.measure=A.selectBoxValue(a)),l.select("input").property("disabled")||(t.threshold=S.numberBoxValue(l)),{workflow:A.selectBoxValue(e.select(".method")),targets:A.checklistBoxValue(e.select(".target")),queryMol:T.queryMolGroupValue(e.select(".qmol")),params:t}}};const E="filter-dialog",z="Search by properties";var G={menuLink:function(e){e.call(y.dropdownMenuModal,z,E,"searchprop")},body:function(e,a){const l=e.call(v.submitDialog,E,z),s=t(a.map(e=>e.fields)).flatten().uniqBy("key").value().filter(e=>e.hasOwnProperty("d3_format")||["compound_id","numeric","text"].includes(e.format));l.select(".modal-body").append("div").classed("key",!0).call(A.selectBox,"filter-field","Field",s,null),l.select(".modal-body").append("div").classed("operator",!0).call(A.selectBox,"filter-op","Operator",[{key:"eq",name:"="},{key:"gt",name:">"},{key:"lt",name:"<"},{key:"ge",name:">="},{key:"le",name:">="},{key:"lk",name:"LIKE"}],"eq"),l.select(".modal-body").append("div").classed("value",!0).call(S.textBox,"filter-value","Value",null,"");const n=a.map(e=>({key:e.id,name:e.name}));l.select(".modal-body").append("div").classed("target",!0).call(A.checklistBox,"struct-target","Target databases",n,null)},query:function(e){return{workflow:"filter",targets:A.checklistBoxValue(e.select(".target")),key:A.selectBoxValue(e.select(".key")),value:S.textBoxValue(e.select(".value")),operator:A.selectBoxValue(e.select(".operator"))}}};const J="sdf-dialog",U="Import SDFile";var K={menuLink:function(e){e.call(y.dropdownMenuModal,U,J,"importsdf")},body:function(t){const a=t.call(v.submitDialog,J,U);a.select(".modal-body").append("div").classed("file",!0).call(S.fileInputBox,"sdf-file","File",".mol,.sdf"),a.select(".modal-body").append("div").classed("field",!0).call(A.checklistBox,"sdf-fields","Fields",[],null),a.select(".modal-body").append("div").classed("implh",!0).call(S.checkBox,"sdf-implh","Make hydrogens implicit",!0),a.select(".modal-body").append("div").classed("recalc",!0).call(S.checkBox,"sdf-recalc","Recalculate 2D coords",!1),a.select(".file").on("change",function(){const t=S.fileInputBoxValue(e.select(this));return f.readFile(t,104857600,!1).then(e=>{const t=function(e){const t=/>.*?<(\S+)>/g,a=new Set;let l;for(;null!==(l=t.exec(e));)a.add(l[1]);return Array.from(a)}(e).map(e=>({key:e,name:e}));a.select(".field").call(A.checklistBoxItems,t)})})},queryFormData:function(e){const t={fields:A.checklistBoxValue(e.select(".field")),implh:S.checkBoxValue(e.select(".implh")),recalc:S.checkBoxValue(e.select(".recalc"))},a=new FormData;return a.append("contents",S.fileInputBoxValue(e.select(".file"))),a.append("params",JSON.stringify(t)),a}};function Q(e){e.fields=s.defaultFieldProperties(e.fields),r.putItem(e).then(e=>{window.open(`datagrid.html?id=${e}`,"_blank")})}function W(e){return r.putItem(e.nodes).then(t=>(e.edges.reference.nodes=t,r.putItem(e.edges))).then(e=>{window.open(`network.html?id=${e}`,"_blank")})}function H(t,a){t.append("td").classed("name",!0).text(a.name),t.append("td").classed("status",!0).text(a.status),t.append("td").classed("size",!0).text(a.records.length);const l=t.append("td").classed("action",!0);l.append("a").call(y.menuButtonLink,"Open","primary","open-white").attr("href",`${{nodes:"datagrid",edges:"network"}[a.dataType]}.html?id=${a.storeID}`).attr("target","_blank");const s=["running","ready"].includes(a.status);l.append("a").call(y.menuModalLink,"delete-dialog","Delete","warning","delete-gray").property("disabled",s).on("click",()=>{e.select("#delete-dialog").select(".message").text(`Are you sure you want to delete ${a.name} ?`),e.select("#delete-dialog").select(".ok").on("click",()=>r.deleteItem(a.storeID).then(X))}).select(".label").text(s?"Running":"Delete")}function X(){r.getItemsByDataType("nodes").then(t=>{e.select("#contents").select(".dg").call(b.updateContents,t,e=>e.storeID,H)}),r.getItemsByDataType("edges").then(t=>{e.select("#contents").select(".nw").call(b.updateContents,t,e=>e.storeID,H)})}function Y(t){const a=s.defaultFieldProperties([{key:"id",name:"Workflow ID",format:"text"},{key:"size",name:"File size",d3_format:".3s"},{key:"status",name:"Status",format:"text"},{key:"created",name:"Created",format:"date"},{key:"expires",name:"Expires",format:"date"}]);e.select("#contents").select(".calc").call(b.updateHeader,a,t.server.calc.records);const l=s.defaultFieldProperties([{key:"key",name:"Key",format:"text"},{key:"value",name:"Value",format:"text"}]),n=Object.entries(t.server).filter(e=>"calc"!==e[0]).map(e=>({key:e[0],value:e[1]}));e.select("#contents").select(".server").call(b.updateHeader,l,n)}function Z(t){const a=e.select("#menubar"),l=a.append("div").call(y.dropdownMenuButton,"Datagrid","primary","plus-white").select(".dropdown-menu");l.append("a").classed("online-command",!0).call(q.menuLink),l.append("a").classed("online-command",!0).call(R.menuLink),l.append("a").classed("online-command",!0).call(G.menuLink),l.append("a").classed("online-command",!0).call(K.menuLink),l.append("a").call(y.dropdownMenuFile,"Import JSON",".ndc,.ndr,.json,.gz","import").on("change",function(){const t=y.dropdownMenuFileValue(e.select(this));f.loadJSON(t).then(Q)}),t.server.instance||a.selectAll(".online-command").attr("data-target",null).classed("disabled",!0),a.append("div").call(y.dropdownMenuButton,"Network","primary","plus-white").select(".dropdown-menu").append("a").call(y.dropdownMenuFile,"Import JSON",".gfc,.gfr,.json,.gz","import").on("change",function(){const t=y.dropdownMenuFileValue(e.select(this));f.loadJSON(t).then(W)}),a.append("a").call(y.menuButtonLink,"Refresh all","outline-secondary","refresh-gray").on("click",()=>{r.getAllItems().then(e=>Promise.all(e.map(e=>i.fetchProgress(e.storeID)))).then(X),i.serverStatus().then(Y)}),a.append("a").call(y.menuModalLink,"reset-dialog","Reset local datastore","warning","delete-gray");const n=s.defaultFieldProperties([{key:"name",name:"Name",format:"text"},{key:"status",name:"Status",format:"text"},{key:"size",name:"Records",d3_format:"d"},{key:"action",name:"Action",format:"control"}]);e.select("#contents").style("padding-left","10%").style("padding-right","10%");const o=e.select("#contents").append("div").classed("py-4",!0);o.append("h5").text("Datagrids on local storage"),o.append("table").classed("dg",!0).call(b.render,null,null,n);const c=e.select("#contents").append("div").classed("py-4",!0);c.append("h5").text("Networks on local storage"),c.append("table").classed("nw",!0).call(b.render,null,null,n),X();const p=e.select("#contents").append("div").classed("py-4",!0);p.append("h5").text("Server calculation job"),p.append("table").classed("calc",!0).call(b.render);const u=e.select("#contents").append("div").classed("py-4",!0);u.append("h5").text("Server status"),u.append("table").classed("server",!0).call(b.render),Y(t);const m=e.select("#dialogs"),h=t.schema.resources.filter(e=>"chemical"===e.domain);m.append("div").call(v.confirmDialog,"reset-dialog","Are you sure you want to delete all local tables and reset the datastore ?").select(".ok").on("click",()=>r.reset().then(X)),m.append("div").call(v.confirmDialog,"delete-dialog",null),m.append("div").call(q.body,t.schema.compoundIDPlaceholder).on("submit",function(){const t=h.map(e=>e.id),a=q.query(e.select(this),t);return d.get(a.workflow,a).then(d.json).then(Q)}),m.append("div").call(R.body,h,t.server.rdkit).on("submit",function(){const t=R.query(e.select(this));return d.get(t.workflow,t).then(d.json).then(Q)}),m.append("div").call(G.body,h).on("submit",function(){const t=G.query(e.select(this));return d.get(t.workflow,t).then(d.json).then(Q)}),m.append("div").call(K.body,h).on("submit",function(){const t=K.queryFormData(e.select(this));return d.post("sdfin",t).then(d.json).then(Q)})}return{run:function(){return document.location.protocol,"onLine"in navigator&&navigator.onLine,console.info("Off-line mode is disabled for debugging"),i.serverStatus().then(Z)}}});
//# sourceMappingURL=dashboardApp.js.map
