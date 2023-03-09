/**
 * Document this bi-snatch.
 */

import * as nwo from './scripts/defs.ts'; // ignore this squigly red line
import * as d3 from 'd3';

interface chartData {number: nwo.logRow[]};
interface configSet {
  height: number,
  width: number,
  margin: {
    left: number,
    right: number,
    top: number,
    bottom: number,
  }
}

let yWhich: string;


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

  // event handlers for the charts
  function pointermoved(event): void {
    const [xm, ym] = d3.pointer(event);
    console.log(`pointerMoved. xm = ${xm} and ym = ${ym}`)
    //const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
    //lines.raise();
    //dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
    //svg.property("value", O[i]).dispatch("input", {bubbles: true});
  }

  function pointerentered() {
    console.log("pointer entered");
    //lines.style("mix-blend-mode", null).style("stroke", "#ddd");
    dot.attr("display", null);
  }

  function pointerleft() {
    console.log("pointer left");
    //path.style("mix-blend-mode", mixBlendMode).style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
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

function svg_base(parent: d3.node, cfg: configSet) {
  return parent
    .append("svg")
    .attr("viewBox", [0, 0, cfg.width, cfg.height])
    .attr("width", "100%")
    .attr("height", "100%")
    //.on("pointerenter", pointerentered)
    //.on("pointermove", pointermoved)
    //.on("pointerleave", pointerleft)
    //.on("touchstart", event => event.preventDefault())
    .on('click', d=>console.log(d.id)) // why wont this do anything?!?!?
    ;
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

function svg_dot(parent: d3.node): d3.node {
  let dot = parent.append("g").attr("display","none");
  dot.append("circle")
     .attr("class","dot-circle")
     .attr("r", 2.5)
  dot.append("text")
     .attr("class","dot-text")
     .attr("text-anchor", "middle")
     .attr("y", -8);
  
  return dot;
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