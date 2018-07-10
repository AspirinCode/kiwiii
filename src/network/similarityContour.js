
/** @module network/similarityContour */

import _ from 'lodash';


function computeSim(ns, es) {
  // nodes.addField({key: 'elevation', name: 'elevation', d3_format: '.3f'});
  // edges.addField({key: 'cweight', name: 'cweight', d3_format: '.3f'});
  const evs = ns.map(n => _.max(n.adjacency.map(e => es[e[1]].weight)));
  const bF = 0.4;  // Base factor
  const cws = es.map(e => {
    const mn = _.min([evs[e.source], evs[e.target]]);
    return (e.weight - bF) / (mn - bF);
  });
  return {
    elevations: evs,
    cweights: cws
  };
}


export default {
  computeSim
};
