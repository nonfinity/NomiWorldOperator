import { test01 } from './d3-tests/test01';
import * as d3 from 'd3';
//import * as d3f from 'd3-force';

interface configSet {
  height: number,
  width: number,
  margin: {
    left: number,
    right: number,
    top: number,
    bottom: number,
  }
};
interface linkDef {
  source: number,
  target: number,
  index?: number,
};

// prepare data
let nodes = node_format(test01);
let links: linkDef[] = link_format(test01);

console.log(nodes);
console.log(links);

// ------------
make_chart()


// make chart stuff
function make_chart(): void {
  let cfg = { height : 400, width: 400, margin: { top: 20, right: 30, bottom: 30, left: 40 } };
  let chartHome: d3.node = d3.select("#chart-home");


  const sim = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(cfg.width/2, cfg.height/2))
    .force("link", d3.forceLink(links).strength(0.1))
    .on('tick', d3ticked)
    ;
  
  // -----------------------
  // MAKE THE CHARTING YAH
  // -----------------------
  const svg = svg_base(chartHome, cfg);
  
  const svg_nodes = svg
    .append("g")
    // add formatting
    .attr("class", "nodes")
    .selectAll('circle')
    .data(nodes)
    .join('circle')
      .attr('r', 8)
      //.attr("fill", "none")
      .attr("stroke", "black")
      .call(drag(sim))
    ;

  //console.log(links);
  const svg_links = svg
    .append("g")
    //add formatting
    .attr("class", "links")
    .attr("stroke", "black")
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
    ;


}

function d3ticked() {
  //console.log('ticked!');
  let tmp: any;
  tmp = d3
    .select('#chart-home')
    .select('g.nodes')
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    //.attr('r', 3)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)

  tmp = d3
    .select('#chart-home')
    .select('g.links')
    .selectAll('line')
    .data(links)
    .join('line')
    
    .attr('x1', d => d.source.x)
    .attr('y1', d => d.source.y)
    .attr('x2', d => d.target.x)
    .attr('y2', d => d.target.y)
}

function drag(simulation) {    
  console.log("dragging");
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

function svg_base(parent: d3.node, cfg: configSet): d3.node {
  return parent
    .append("svg")
    .attr("viewBox", [0, 0, cfg.width, cfg.height])
    .attr("width", cfg.width) //"100%")
    .attr("height", cfg.height) //"100%")
    //.on('click', d=>console.log("clicky clack")) // why wont this do anything?!?!?
    ;
}

function node_format(data): any[] {
  let out = [];
  
  let t = data['environment']['hubs']
  for(let i in data['environment']['hubs']) {
    out.push({world_id: t[i].id, name: t[i].name})
  }

  return out;
}

function link_format(data): linkDef[] {
  let out: linkDef[] = [];

  let home = data['environment']['edges']
  for(let i in home) {
    console.log(home[i].pointA.id);
    let tmp: linkDef = { source: home[i].pointA.id, target: home[i].pointB.id };
    out.push(tmp);
  }

  return out;
}