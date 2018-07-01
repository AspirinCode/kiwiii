// https://github.com/mojaie/kiwiii Version 0.14.0. Copyright 2018 Seiji Matsuoka.
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("d3"),require("lodash"),require("vega")):"function"==typeof define&&define.amd?define(["d3","lodash","vega"],t):e.profileApp=t(e.d3,e._,e.vega)}(this,function(e,t,s){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e,t=t&&t.hasOwnProperty("default")?t.default:t,s=s&&s.hasOwnProperty("default")?s.default:s;var r={defaultFieldProperties:function(e){return e.map(e=>(e.hasOwnProperty("name")||(e.name=e.key),e.hasOwnProperty("visible")||(e.visible=!0),e.hasOwnProperty("d3_format")&&(e.format="d3_format"),e.hasOwnProperty("format")||(e.format="raw"),e))},sortType:function(e){return["numeric","d3_format"].includes(e)?"numeric":["text","compound_id","assay_id","list"].includes(e)?"text":"none"},formatNum:function(t,s){return null==t||Number.isNaN(t)?"":t==parseFloat(t)?e.format(s)(t):t},partialMatch:function(e,t){return null!=t&&""!==t&&-1!==t.toString().toUpperCase().indexOf(e.toString().toUpperCase())},URLQuery:function(){const e=window.location.search.substring(1).split("&").map(e=>e.split("="));return t.fromPairs(e)},uuidv4:function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})}};const o="";var a={get:function(e,t={}){const s=Object.keys(t).length?`?query=${JSON.stringify(t)}`:"";return fetch(`${o}${e}${s}`,{credentials:"include"}).then(e=>200!==e.status?Promise.reject(new Error(e.statusText)):Promise.resolve(e))},json:function(e){return e.json()},text:function(e){return e.text()},blob:function(e){return e.blob()},post:function(e,t){return fetch(`${o}${e}`,{method:"POST",body:t,credentials:"include"}).then(e=>200!==e.status?Promise.reject(new Error(e.statusText)):Promise.resolve(e))},error:function(e){return console.error(e),null}};var l={buttonBox:function(e,t,s,r){e.classed("form-group",!0).classed("mb-1",!0).append("button").classed("btn",!0).classed(`btn-${r}`,!0).classed("btn-sm",!0).attr("id",t).text(s)},menuButton:function(e,t,s,r){e.classed("btn",!0).classed(`btn-${s}`,!0).classed("btn-sm",!0).classed("mr-1",!0).attr("id",r).text(t)},menuButtonLink:function(e,t,s,r,o){e.classed("btn",!0).classed(`btn-${s}`,!0).classed("btn-sm",!0).classed("mr-1",!0).attr("role","button").attr("href","#").attr("id",o),e.append("img").attr("src",r?`./assets/icon/${r}.svg`:null).style("width","1.25rem").style("height","1.25rem"),e.append("span").style("vertical-align","middle").text(t)},menuModalLink:function(e,t,s,r,o,a){e.classed("btn",!0).classed(`btn-${r}`,!0).classed("btn-sm",!0).classed("mr-1",!0).attr("id",a).attr("href","#").attr("role","button").attr("data-toggle","modal").attr("data-target",`#${t}`),e.append("img").attr("src",o?`./assets/icon/${o}.svg`:null).style("width","1.25rem").style("height","1.25rem"),e.append("span").classed("label",!0).style("vertical-align","middle").text(s)},dropdownMenuButton:function(e,t,s,r,o){e.classed("btn-group",!0).classed("mr-1",!0).attr("id",o);const a=e.append("button").classed("btn",!0).classed(`btn-${s}`,!0).classed("btn-sm",!0).classed("dropdown-toggle",!0).attr("data-toggle","dropdown");a.append("img").attr("src",r?`./assets/icon/${r}.svg`:null).style("width","1.25rem").style("height","1.25rem"),a.append("span").style("vertical-align","middle").text(t),e.append("div").classed("dropdown-menu",!0)},dropdownMenuItem:function(e,t,s,r){e.classed("dropdown-item",!0).attr("id",r).attr("href","#"),e.append("img").attr("src",s?`./assets/icon/${s}.svg`:null).classed("mr-1",!0).style("width","2rem").style("height","2rem"),e.append("span").text(t)},dropdownMenuModal:function(e,t,s,r,o){e.classed("dropdown-item",!0).attr("id",o).attr("href","#").attr("data-toggle","modal").attr("data-target",`#${s}`),e.append("img").attr("src",`./assets/icon/${r}.svg`).classed("mr-1",!0).style("width","2rem").style("height","2rem"),e.append("span").text(t)},dropdownMenuFile:function(t,s,r,o,a){t.classed("dropdown-item",!0).attr("id",a).attr("href","#").on("click",function(){e.select(this).select("input").node().click()}),t.append("form").style("display","none").append("input").attr("type","file").attr("accept",r),t.append("img").attr("src",`./assets/icon/${o}.svg`).classed("mr-1",!0).style("width","2rem").style("height","2rem"),t.append("span").text(s)},dropdownMenuFileValue:function(e){return e.select("input").node().files[0]}};function n(e,t,s){const o=e.select("thead tr").selectAll("th").data(t);o.exit().remove(),o.enter().append("th").text(e=>e.name),s&&e.call(i,s,e=>e.key,function(e){return(t,s)=>{e.forEach(e=>{const o=s[e.key],a=t.append("td").classed("align-middle",!0);void 0!==o&&("d3_format"===e.format?a.text(r.formatNum(o,e.d3_format)):"plot"===e.format?a.text("[plot]"):"image"===e.format?a.text("[image]"):"control"===e.format?a.call(o):a.text(o))})}}(t))}function i(t,s,r,o){const a=t.select("tbody").selectAll("tr").data(s,r);a.exit().remove(),a.enter().append("tr").merge(a).each(function(t){e.select(this).selectAll("td").remove(),e.select(this).call(o,t)})}var d={render:function(e,t,s,r,o){e.classed("table",!0).classed("table-striped",!0).classed("table-hover",!0).attr("id",t),s&&e.append("caption").text(s),e.append("thead").append("tr"),e.append("tbody"),r&&e.call(n,r,o)},updateHeader:n,updateContents:i};function c(e){const t={};return Object.entries(e.mapping).forEach(e=>{t[e[0]]=[e[1]]}),{created:e.created,fields:[e.field],key:e.key,mapping:t}}var p={singleToMulti:c,mappingToTable:function(e){const t=e.hasOwnProperty("field")?c(e):e,s={key:t.key,format:"text"};return{fields:r.defaultFieldProperties([s].concat(t.fields)),records:Object.entries(t.mapping).map(e=>{const s={};return s[t.key]=e[0],t.fields.forEach((t,r)=>{s[t.key]=e[1][r]}),s})}},tableToMapping:function(e,t,s=["index"]){const o={created:(new Date).toString(),fields:r.defaultFieldProperties(e.fields.filter(e=>e.key!==t).filter(e=>!s.includes(e.key))),key:t,mapping:{}};return e.records.forEach(e=>{o.mapping[e[t]]=o.fields.map(t=>e[t.key])}),o},csvToMapping:function(e){const t=e.split(/\n|\r|\r\n/),s=t.shift().split(","),o=s.shift(),a=new Date,l=[],n=[];s.forEach((e,t)=>{""!==e&&(l.push(t),n.push({key:e,format:"text"}))});const i={created:a.toString(),fields:r.defaultFieldProperties(n),key:o,mapping:{}};return t.forEach(e=>{const t=e.split(","),s=t.shift();i.mapping[s]=Array(l.length),l.forEach(e=>{i.mapping[s][e]=t[e]})}),i},apply:function(e,s){const o=s.hasOwnProperty("field")?c(s):s;e.records.filter(e=>o.mapping.hasOwnProperty(e[o.key])).forEach(e=>{o.fields.forEach((t,s)=>{e[t.key]=o.mapping[e[o.key]][s]})}),e.fields=t(e.fields).concat(r.defaultFieldProperties(o.fields)).uniqBy("key").value()}};function u(e,t,s){e.text(r.formatNum(t[s.key],s.d3_format))}function f(e,t,s){e.text(t[s.key])}function m(e,t,s){e.html(t[s.key])}function h(e,t,s){e.append("a").attr("href",`profile.html?compound=${t[s.key]}`).attr("target","_blank").text(t[s.key])}function y(e,t,s){e.append("img").attr("width",180).attr("height",180).attr("src",t[s.key])}function g(e,t,s){e.append("input").attr("type","checkbox").property("checked",t[s.key]).property("disabled",!!s.disabled&&t[s.disabled]).on("click",function(){t[s.key]=this.checked})}function x(e,t,s){e.append("input").attr("type","text").style("width","90%").property("value",t[s.key]).on("change",function(){t[s.key]=this.value})}function w(e,t){e.call(t)}const v={numeric:f,text:f,raw:f,d3_format:u,compound_id:h,assay_id:f,list:f,plot:{plotCell:function(e,t,r){new s.View(s.parse(t[r.key])).initialize(e.node()).run()},plotThumbnail:function(e){return new s.View(s.parse(e)).toImageURL("png")},binaryToDataURI:function(e){return new Promise(t=>{const s=new FileReader;s.onload=(e=>{t(e.target.result)}),s.readAsDataURL(e)})}}.plotCell,image:y,checkbox:g,text_field:x,control:w,svg:m,html:m};var b={d3Format:u,text:f,html:m,compound_id:h,image:y,checkbox:g,textField:x,call:w,rowFactory:function(e){return(t,s)=>{e.forEach(e=>{const r=t.append("div").classed("dg-cell",!0).classed("align-middle",!0).classed("text-truncate",!0).style("display","inline-block").style("width",`${e.width}%`);s.hasOwnProperty(e.key)&&r.call(v[e.format],s,e)})}}};class k{constructor(e){this.data=e,this.visibleFields=null,this.sortedRecords=null,this.filteredRecords=null;const t=this.data.snapshot||{sortOrder:[],filterText:null};this.sortOrder=t.sortOrder||[],this.filterText=t.filterText||null,this.defaultColumnHeight={numeric:40,text:40,none:200},this.scrollBarSpace=20,this.keyFunc=(e=>e.index),this.rowHeight=null,this.contentWidth=null,this.bodyHeight=null,this.viewportHeight=null,this.numViewportRows=null,this.previousNumViewportRows=null,this.viewportTop=null,this.previousVieportTop=null,this.viewportBottom=null,this.currentScrollTop=0,this.fixedViewportHeight=null,this.updateContentsNotifier=null,this.updateFilterNotifier=null,this.rowFactory=(()=>b.rowFactory(this.visibleFields)),this.applyData()}setViewportSize(e){this.viewportHeight=this.fixedViewportHeight||e,this.previousNumViewportRows=this.numViewportRows,this.numViewportRows=Math.ceil(this.viewportHeight/this.rowHeight)+1}setScrollPosition(e){this.previousViewportTop=this.viewportTop,this.viewportTop=e,this.viewportBottom=Math.min(this.viewportTop+this.numViewportRows,this.filteredRecords.length)}setSortOrder(e,t){const s=this.sortOrder.findIndex(e=>e.key),r={key:e,order:t};-1!==s&&this.sortOrder.splice(s,1),this.sortOrder.splice(0,0,r),this.applyOrder(e,t)}setFilterText(e){this.filterText=e,this.applyFilter()}joinFields(e){p.apply(this.data,e),this.applyData()}applyData(){this.visibleFields=this.data.fields.filter(e=>e.visible);const e=this.visibleFields.reduce((e,t)=>e+(t.widthf||1),0);this.visibleFields=this.visibleFields.map(t=>{const s={width:(t.widthf||1)/e*100,height:t.height||this.defaultColumnHeight[r.sortType(t.format)]};return Object.assign(s,t)}),this.rowHeight=this.visibleFields.reduce((e,t)=>e.height>t.height?e:t).height,this.applyOrder()}applyOrder(e,s){if(e)this.sortedRecords=t.orderBy(this.data.records.slice(),[e],[s]);else{const e=this.sortOrder.map(e=>e.key),s=this.sortOrder.map(e=>e.order);e&&(this.sortedRecords=t.orderBy(this.data.records.slice(),e,s))}this.applyFilter()}applyFilter(){if(null===this.filterText)this.filteredRecords=this.sortedRecords.slice();else{const e=this.visibleFields.filter(e=>"none"!==r.sortType(e.format)).map(e=>e.key);this.filteredRecords=this.sortedRecords.filter(t=>e.some(e=>r.partialMatch(this.filterText,t[e])))}this.bodyHeight=this.filteredRecords.length*this.rowHeight}recordsToShow(){return this.filteredRecords.slice(this.viewportTop,this.viewportBottom)}export(){return this.data.id=r.uuidv4(),this.data}}function F(t,s){t.select(".dg-body").style("height",`${s.bodyHeight}px`);const r=t.select(".dg-body").selectAll(".dg-row").data(s.recordsToShow(),s.keyFunc);r.exit().remove(),r.enter().append("div").attr("class","dg-row").style("position","absolute").style("width","100%").merge(r).style("height",`${s.rowHeight}px`).each(function(t,r){const o=s.viewportTop+r,a=o*s.rowHeight;e.select(this).style("transform",`translate(0px, ${a}px)`).classed("odd",o%2==0),e.select(this).selectAll(".dg-cell").remove(),e.select(this).call(s.rowFactory(),t,o)})}var T={updateHeader:function(e,t){const s=e.select(".dg-header");s.selectAll(".dg-hcell").remove(),s.selectAll(".dg-hcell").data(t.visibleFields).enter().append("div").classed("dg-hcell",!0).style("display","inline-block").style("width",e=>`${e.width}%`).text(e=>e.name),e.style("width","100%").dispatch("resize");const r=Math.floor(t.currentScrollTop/t.rowHeight);t.setScrollPosition(r),e.call(F,t)},updateRows:F,resizeViewport:function(e,t){e.select(".dg-viewport").style("height",`${t.viewportHeight}px`)}};function B(e,t){const s=e.select(".dg-viewport").node().getBoundingClientRect().top;t.setViewportSize(window.innerHeight-s-5),e.call(T.resizeViewport,t)}var _={resize:B,datagrid:function(e,t){e.selectAll("div").remove(),e.on("resize",()=>e.call(B,t)),e.append("div").classed("dg-header",!0),e.append("div").classed("dg-viewport",!0).style("overflow-y","auto").on("scroll",function(){const s=Math.floor(this.scrollTop/t.rowHeight);t.currentScrollTop=this.scrollTop,s!==t.previousViewportTop&&(t.setScrollPosition(s),e.call(T.updateRows,t))}).append("div").classed("dg-body",!0).style("position","relative"),t.updateContentsNotifier=(()=>{t.applyData(),e.call(T.updateHeader,t)}),t.updateFilterNotifier=(s=>{t.setFilterText(s),t.setScrollPosition(0),e.call(T.updateRows,t),e.select(".dg-viewport").node().scrollTop=0}),t.updateContentsNotifier()}};function O(e,t){e.select("input").property("value",t)}function P(e,t){e.select("textarea").property("value",t)}function V(e,t){e.select("input").property("checked",t)}function H(e,t){e.select("input").property("value",t)}function R(e,t){e.select("input").property("value",t)}var $={textBox:function(e,t,s,r,o){e.classed("form-group",!0).classed("form-row",!0).classed("align-items-center",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(s),e.append("input").classed("form-control",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("id",t).attr("type","text").attr("size",r),e.call(O,o)},updateTextBox:O,textBoxValue:function(e){return e.select("input").property("value")},readonlyBox:function(e,t,s,r){e.classed("form-group",!0).classed("form-row",!0).classed("align-items-center",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(s),e.append("input").classed("form-control-plaintext",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("id",t).attr("type","text").property("readonly",!0),e.call(O,r)},textareaBox:function(e,t,s,r,o,a){e.classed("form-group",!0).classed("form-row",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(s),e.append("textarea").classed("form-control",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("rows",r).attr("placeholder",o).attr("id",t),e.call(P,a)},updateTextareaBox:P,textareaBoxValue:function(e){const t=e.select("textarea").property("value");if(t)return t;const s=e.select("textarea").attr("placeholder");return s||""},textareaBoxLines:function(e){const t=e.select("textarea").property("value");if(t)return t.split("\n").filter(e=>e.length>0);const s=e.select("textarea").attr("placeholder");return s?s.split("\n").filter(e=>e.length>0):[]},checkBox:function(e,t,s,r){const o=e.classed("form-group",!0).classed("form-row",!0).classed("form-check",!0).append("label").classed("form-check-label",!0).classed("col-form-label-sm",!0);o.append("input").classed("form-check-input",!0).attr("type","checkbox").attr("id",t),o.append("span").text(s),e.call(V,r)},updateCheckBox:V,checkBoxValue:function(e){return e.select("input").property("checked")},numberBox:function(e,t,s,r,o,a,l){e.classed("form-group",!0).classed("form-row",!0).classed("align-items-center",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(s),e.append("input").classed("form-control",!0).classed("form-control-sm",!0).classed("col-8",!0).attr("id",t).attr("type","number").attr("min",r).attr("max",o).attr("step",a),e.call(H,l)},updateNumberBox:H,numberBoxValue:function(e){return e.select("input").property("value")},colorBox:function(t,s,r){t.classed("form-row",!0).classed("align-items-center",!0),t.append("div").classed("form-group",!0).classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).classed("mb-1",!0).text(s),t.append("div").classed("form-group",!0).classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).classed("mb-1",!0).append("input").classed("form-control",!0).classed("form-control-sm",!0).attr("type","color"),t.call(R,r).on("change",()=>{e.event.stopPropagation()})},updateColorBox:R,colorBoxValue:function(e){return e.select("input").property("value")},fileInputBox:function(e,t,s,r){e.classed("form-group",!0).classed("form-row",!0),e.append("label").classed("col-form-label",!0).classed("col-form-label-sm",!0).classed("col-4",!0).attr("for",t).text(s),e.append("input").classed("form-control",!0).classed("form-control-sm",!0).classed("form-control-file",!0).classed("col-8",!0).attr("type","file").attr("accept",r).attr("id",t)},fileInputBoxValue:function(e){return e.select("input").property("files")[0]}};var S={setFilter:function(e,t){const s=e.classed("row",!0).classed("justify-content-end",!0).append("div").classed("col-5",!0).call($.textBox,null,"Search",40,null);s.select("label").classed("text-right",!0),s.select("input").on("keyup",function(){t.updateFilterNotifier($.textBoxValue(s))})}};function M(t){a.get("schema").then(a.json).then(e=>(function(e,t){const s={},o={workflow:"search",targets:t.filter(e=>"chemical"===e.domain).map(e=>e.id),key:"compound_id",values:[e]};return a.get(o.workflow,o).then(a.json).then(e=>{s.compound={fields:[{key:"key",name:"key"},{key:"value",name:"value"}],records:[{key:"Formula",value:e.records[0]._formula},{key:"Molecular weight",value:e.records[0]._mw},{key:"Wildman-Crippen logP",value:e.records[0]._logp},{key:"Non-hydrogen atom count",value:e.records[0]._nonH}]},s.cid=e.records[0].compound_id,s.name=e.records[0].name,s.src=e.records[0].__source,s.struct=e.records[0].structure}).then(()=>{const e={workflow:"exact",targets:t.filter(e=>"chemical"===e.domain).map(e=>e.id),queryMol:{format:"dbid",source:s.src,value:s.cid},params:{ignoreHs:!0}};return a.get(e.workflow,e)}).then(a.json).then(e=>{s.aliases=e,s.aliases.fields=r.defaultFieldProperties([{key:"index",name:"Index",d3_format:"d"},{key:"compound_id",name:"Compound ID",format:"compound_id"},{key:"name",name:"Name",format:"text"},{key:"__source",name:"Source",format:"text"}])}).then(()=>{const s={workflow:"profile",compound_id:e,targets:t.filter(e=>"activity"===e.domain).map(e=>e.id)};return a.get(s.workflow,s)}).then(a.json).then(e=>(s.assays=e,s.assays.fields=r.defaultFieldProperties([{key:"index",name:"Index",d3_format:"d"},{key:"assay_id",name:"Assay ID",format:"assay_id"},{key:"value_type",name:"Value type",format:"text"},{key:"value",name:"Value",format:"numeric"}]),s))})(t,e.resources)).catch(()=>(console.info("Server did not respond"),{aliases:{},assays:{},compound:{}})).then(t=>{const s=e.select("#contents").style("padding-left","10%").style("padding-right","10%");s.append("h2").classed("mt-5",!0).text("Compound ID"),s.append("div").classed("mb-5",!0).text(t.cid),s.append("h2").classed("mt-5",!0).text("Name"),s.append("div").classed("mb-5",!0).text(t.name),s.append("h2").classed("mt-5",!0).text("Source"),s.append("div").classed("mb-5",!0).text(t.src),s.append("h2").classed("mt-5",!0).text("Structure"),s.append("div").classed("mb-5",!0).html(t.struct),s.append("h2").classed("mt-5",!0).text("Chemical properties"),s.append("div").classed("mb-5",!0).append("table").call(d.render,null,null,t.compound.fields,t.compound.records).style("width","400px"),s.append("h2").classed("mt-5",!0).text("Aliases"),s.append("div").classed("mb-5",!0).attr("id","aliases"),s.append("h2").classed("mt-5",!0).text("Assay results"),s.append("div").classed("mb-5",!0).attr("id","assays");const r=new k(t.aliases),o=e.select("#aliases").append("div").classed("alias-filter",!0),a=e.select("#aliases").append("div").classed("alias-dg",!0);r.fixedViewportHeight=150,a.call(_.datagrid,r),o.call(S.setFilter,r);const l=new k(t.assays),n=e.select("#assays").append("div").classed("assay-filter",!0),i=e.select("#assays").append("div").classed("assay-dg",!0);l.fixedViewportHeight=400,i.call(_.datagrid,l),n.call(S.setFilter,l)})}return{run:function(){e.select("#menubar").append("a").call(l.menuButtonLink,"Dashboard","outline-secondary","db-gray").attr("href","dashboard.html").attr("target","_blank");const t=r.URLQuery().compound||null;if(!t)return;return document.location.protocol,"onLine"in navigator&&navigator.onLine,console.info("Off-line mode is disabled for debugging"),M(t)}}});
//# sourceMappingURL=profileApp.js.map