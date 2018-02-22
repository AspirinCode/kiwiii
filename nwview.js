d3.request("https://mojaie.github.io/kiwiii/resources/DrugBank5.0.5_FDA_Approved_GLS08.gfc")
  .responseType("arraybuffer")
  .get(res => {
    const data = JSON.parse(pako.inflate(res.response, {to: 'string'}));
    const width = 1000;
    const height = 600;
    const simulation = kwnetwork.force.forceSimulation(width, height);
    const state = new kwnetwork.NetworkState(data, width, height);
    const frame = d3.select('#nwview')
        .call(kwnetwork.view.networkViewFrame, state);
    frame.select('.nw-view')
      .call(kwnetwork.view.networkView, state)
      .call(kwnetwork.interaction.setInteraction, state)
      .call(kwnetwork.force.activate, simulation, state);
  });
