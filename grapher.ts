/**
 * Needed Graphs:
 * 1. Force directed graph
 * 2. Line graph for prices
 * 3. Line graph for inventory (may use same logic as #2)
 * 
 * Goal: at most, expose a single function for each one
 * 
 */
import * as nwo from './scripts/nwo_v001'; // ignore this squigly red line
import * as d3 from 'd3';

interface logRow {
  time: number,
  hub_id: number,
  hub_name: string,
  item_id: number,
  item_name: string,
  inventory: number,
  invRatio: number,
  price: number,
};
interface chartData {number: logRow[]};
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

let yWhich: string;


export function forceMapInitialize(home: string, world: nwo.World, cfg: configSet): void {
  let svg = d3.select(`#${home}`);

  svg = svg_base(svg, cfg);

  let nodes = node_format(world);
  let links: linkDef[] = link_format(world);


  const sim = d3.forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-500))
    .force("center", d3.forceCenter(cfg.width/2, cfg.height/2))
    .force("link", d3.forceLink(links).strength(0.1))
    .on('tick', d => forceTicked(nodes, links) )
    ;
  
  // -----------------------
  // MAKE THE CHARTING YAH
  // -----------------------
  
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

export function forceMapUpdate(home: string, world: nwo.World, cfg: configSet): void {
  // the update to the forceMap is moving the shipments around
}

export function lineChartInitialize(home: string, world: nwo.World, cfg: configSet, fieldSource: string): void {
  let svg = d3.select(`#${home}`);

  svg = svg_base(svg, cfg);
}

export function lineChartUpdate(home: string, world: nwo.World, cfg: configSet, fieldSource: string): void {

}


export function make_chart(where: string, world: nwo.World, cfg: configSet, type: string): void {

  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  // set which field is the source for this graphic
  switch (type) {
    case 'price':
      yWhich = "price";
      break;
    
    case 'inventory':
      yWhich = "inventory"
      break;
    
    default:
      throw Error(`Error: Invalid chart type. Given value = ${type}`);
  }

  // prepare data
  let data: chartData[] = format_data(world);

  // determine the scales
  let xScale = calc_xScale(data, world, cfg);
  let yScale = calc_yScale(data, world, cfg);

  // make the axes
  const xAxis = d3.axisBottom(xScale).ticks(cfg.width / 40)
  const yAxis = d3.axisLeft(yScale).ticks(cfg.height / 30)
  
  // add a chart title
  // add a legend

  // line generator
  let line: d3.line = d3
    .line()
    .x(d => xScale(+d.time))
    .y(d => yScale(+d[yWhich]))
    .curve(d3.curveLinear);
  
  // -----------------------
  // MAKE THE CHARTING YAH
  // -----------------------
  
  
  const div = d3.create("div")
  const svg = svg_base(div, cfg);
  const lines = svg_lines(svg, data, line);
  
  // add the axes display
  svg_xAxis(svg, cfg, xAxis);
  svg_yAxis(svg, cfg, yAxis);
  
  // testing to add grid lines
  svg_xGridLines(svg, cfg, xScale);


  // make a dot that indicates selected line
  //const dot = svg_dot(svg);

  // update the DOM element and actually add it to the page
  d3.select(where).html("")
  d3.select(where).html(div.html())



}


function format_data(world: nwo.World): chartData[] {
  let out: chartData[] = [];

  for(let i in world.hubs) {
    out.push(
      world.log.ticks.filter( ({ hub_name }) => hub_name === world.hubs[i].name)
    )
  }

  return out;
}

function calc_yScale(data: chartData[], world: nwo.World, cfg: configSet): d3.node {
  // determine the scales
  let values = world.log.ticks.map(d => d[yWhich])
  let yExtra: number = .15
  
  return d3
      .scaleLinear(
        // domain
        [ d3.min(values) * (1 - yExtra), d3.max(values) * (1 + yExtra) ],
        // range
        [cfg.height - cfg.margin.bottom, cfg.margin.top] )
}

function calc_xScale(data: chartData[], world: nwo.World, cfg: configSet): d3.node {
  // determine the scales
  return d3
      .scaleLinear(
        // domain (ignore the squiggly. it's actually fine)
        [ data[0][0].time, data[0][data[0].length - 1].time ],
        // range
        [cfg.margin.left, cfg.width - cfg.margin.right] )
}

function svg_base(svg: d3.node, cfg: configSet) {
  svg
    .attr("viewBox", [0, 0, cfg.width, cfg.height])
    ;
  
  return svg;
}

function svg_lines(parent: d3.node, data: nwo.logRow[], line: d3.line, colors?: d3.scaleOrdinal) {
  if (colors === undefined) {
    colors = d3.scaleOrdinal(d3.schemeCategory10);
  }

  return parent
    .append("g")
    .attr('class', 'lineGroup')
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('class', 'value-lines')
    .attr('d', line)
    .style('stroke', (d, i) => colors(d[i]))
    .style('stroke-width', 2)
    .style('fill', 'transparent')
}

function svg_xAxis(parent: d3.node, cfg: configSet, xAxis: d3.node) {
  return parent
    .append("g")
    .attr('class','x-axis')
    .attr("transform", `translate(0, ${cfg.height - cfg.margin.bottom})`)
    .call(xAxis);
}

function svg_yAxis(parent: d3.node, cfg: configSet, yAxis: d3.node) {
  return parent
    .append("g")
    .attr('class', 'y-axis')
    .attr("transform", `translate(${cfg.margin.left}, 0)`)
    .call(yAxis)
}


function svg_xGridLines(parent: d3.node, cfg: configSet, xScale: d3.scale) {
  let temp = parent
    .append("g")
    .attr('class', "xGridLine-group")
    .selectAll('line')
    .data(xScale.ticks())
    .join('line')
  
  temp
    .attr('class', "xGridLine")
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', cfg.margin.top)
    .attr('y2', cfg.height - cfg.margin.bottom)
    .style("stroke-width", 0.2)
    .style("stroke", "black")
  
  temp  // why won't these event handlers work!?!?!?
    .on("pointerenter", xGridGlow)
    .on("pointerleft", xGridDim)
    .on('click', d=>console.log(d.id))

  return temp;

  function xGridGlow(event) {
    console.log("xGridGlow");
    event.currentTarget
      .style("stroke-width", 5.5);
  }

  function xGridDim(event) {
    event.currentTarget
      .style("stroke-width", 0.2);
  }
}


function forceTicked(nodes, links) {
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

function node_format(data): any[] {
  let out = [];
  
  let t = data['hubs']
  for(let i in data['hubs']) {
    out.push({world_id: t[i].id, name: t[i].name})
  }

  return out;
}

function link_format(data): linkDef[] {
  let out: linkDef[] = [];

  let home = data['edges']
  for(let i in home) {
    //console.log(home[i].pointA.id);
    let tmp: linkDef = { source: home[i].pointA.id, target: home[i].pointB.id };
    out.push(tmp);
  }

  return out;
}