d3.request("https://mojaie.github.io/kiwiii/resources/DrugBank5.0.5_FDA_Approved.ndc")
  .responseType("arraybuffer")
  .get(res => {
    const data = JSON.parse(pako.inflate(res.response, {to: 'string'}));
    const state = new kwdatagrid.DatagridState(data);
    d3.select('#datagrid')
      .call(kwdatagrid.view.datagrid, state)
      .call(kwdatagrid.sort.setSort, state)
      .style("transform-origin", "top left")
      .style("transform", "scaleX(0.9) scaleY(0.9)");
  });
