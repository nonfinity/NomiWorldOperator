import * as nwo from './scripts/nwo_v001';
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
};

export class lineChart {
  cfg: configSet;
  parent: d3.node;
  svg: { [key : string] : d3.node } = {
    _root      : undefined,
    chartlines : undefined,
    gridlines  : undefined,
    xAxis     : undefined,
    yAxis     : undefined,
  }

  log;
  hubSet: string[] = [];
  data: chartData[];
  recordName: string;
  colors = d3.scaleOrdinal(d3.schemeCategory10);

  xScale: d3.node;
  yScale: d3.node;
  xAxis: d3.node;
  yAxis: d3.node;
  line: d3.line;
  

  constructor(parent_id: string, cfg: configSet, world: nwo.World, recordName: string) {
    this.parent = d3.select(`#${parent_id}`);
    this.cfg = cfg;

    this.recordName = recordName;
    for(let i in world.hubs) {
      this.hubSet.push(world.hubs[i].name);
    }
    
    this._world_update(world);
    this._data_prep();


    this._make_svg();
    this._render_chart();

    console.log(this);
  }

  update(world: nwo.World) {
    this._world_update(world);
    this._data_prep();

    this.svg.xAxis.call(this.xAxis);
    this.svg.yAxis.call(this.yAxis);

    this.svg.gridlines
      .selectAll('line')
      .data(this.xScale.ticks())
      .join(
        enter => enter
          .append('line')
          .attr('x1', d => this.xScale(d))
          .attr('x2', d => this.xScale(d))
          .attr('y1', this.cfg.margin.top)
          .attr('y2', this.cfg.height - this.cfg.margin.bottom)
          .style("stroke-width", 0.2)
          .style("stroke", "black"),
        update => update,
        exit => exit
          .call(item => item.remove() )
        )
      ;

    this.svg.chartlines
      .selectAll('path')
      .data(this.data, d => d[this.recordName])
      .join(
        enter => enter
          .append('path')
          .attr('class', 'chartline')
          .attr('d', this.line)
          .style('stroke', (d, i) => this.colors(d[i]))
          .style('stroke-width', 2)
          .style('fill', 'transparent'),
        update => update,
        exit => exit
          .call(item => item.remove() )
        )
      ;
  }

  private _world_update(world: nwo.World) {
    this.log = world.log;
    
    // format data based on this.log
    this._process_log();
  }

  private _data_prep() {

    // determine the scales based on this.data
    this.xScale = this._calc_xScale();
    this.yScale = this._calc_yScale();



    // set axis based on scales
    this.xAxis = d3.axisBottom(this.xScale).ticks(this.cfg.width / 40)
    this.yAxis = d3.axisLeft(this.yScale).ticks(this.cfg.height / 30)

    // refresh line based on scales
    this.line = d3
      .line()
      .x(d => this.xScale(+d.time))
      .y(d => this.yScale(+d[this.recordName]))
      .curve(d3.curveLinear);
  }

  private _render_chart(): void {


  }

  private _make_svg(): void {
    this.svg._root = this.parent
      .append("svg")
      .attr("viewBox", [0, 0, this.cfg.width, this.cfg.height])
      ;
    
    this.svg.xAxis = this.svg._root
      .append("g")
      .attr('class','xAxis')
      .attr("transform", `translate(0, ${this.cfg.height - this.cfg.margin.bottom})`)
      .call(this.xAxis)
      ;
    
    this.svg.yAxis = this.svg._root
      .append("g")
      .attr('class', 'yAxis')
      .attr("transform", `translate(${this.cfg.margin.left}, 0)`)
      .call(this.yAxis)
      ;
    
    this.svg.gridlines = this.svg._root
      .append("g")
      .attr('class', "gridlines")
      ;

    this.svg.chartlines = this.svg._root
      .append("g")
      .attr('class', 'chartlines')
      ;

  }

  private _process_log(): void {
    this.data = [];

    for(let i in this.hubSet) {
      let k = this.log.ticks.filter( ({ hub_name }) => hub_name === this.hubSet[i])
      this.data.push(k)
    }
  }

  private _calc_yScale(): d3.node {
    // determine the scales
    let values = this.log.ticks.map(d => d[this.recordName])
    let yExtra: number = .15
    
    let domain = [0, 10];
    if(values.length === 0)  {
      domain = [ d3.min(values) * (1 - yExtra), d3.max(values) * (1 + yExtra) ];
    }

    let range = [this.cfg.height - this.cfg.margin.bottom, this.cfg.margin.top];

    return d3.scaleLinear(domain, range)
  }

  private _calc_xScale(): d3.node {
    // determine the scales
    let domain_max: number = 2;
    if (this.data.length > 0) {
      if (this.data[0].length > 0) {
        domain_max = Math.max(domain_max, this.data[0][this.data[0].length - 1].time);
      }
    }

    let range = [this.cfg.margin.left, this.cfg.width - this.cfg.margin.right];


    return d3.scaleLinear([1, domain_max], range);
  }

  private _svg_xGridLines() {
    let temp = this.svg
      .append("g")
      .attr('class', "xGridLine-group")
      .selectAll('line')
      .data(this.xScale.ticks())
      .join('line')
    
    temp
      .attr('class', "xGridLine")
      .attr('x1', d => this.xScale(d))
      .attr('x2', d => this.xScale(d))
      .attr('y1', this.cfg.margin.top)
      .attr('y2', this.cfg.height - this.cfg.margin.bottom)
      .style("stroke-width", 0.2)
      .style("stroke", "black")
    
    /*
    temp  // why won't these event handlers work!?!?!?
      .on("pointerenter", xGridGlow)
      .on("pointerleft", xGridDim)
      .on('click', d=>console.log(d.id))
    */
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

  private _svg_xAxis(): void {
    this.svg
      .append("g")
      .attr('class','x-axis')
      .attr("transform", `translate(0, ${this.cfg.height - this.cfg.margin.bottom})`)
      .call(this.xAxis)
      ;
  }

  private _svg_yAxis(): void {
    this.svg
      .append("g")
      .attr('class', 'y-axis')
      .attr("transform", `translate(${this.cfg.margin.left}, 0)`)
      .call(this.yAxis)
      ;
  }

  private _svg_chartLines(): void {
    this.svg
      .append("g")
      .attr('class', 'lineGroup')
      .selectAll('path')
      .data(this.data)
      .join('path')
      .attr('class', 'value-lines')
      .attr('d', this.line)
      .style('stroke', (d, i) => this.colors(d[i]))
      .style('stroke-width', 2)
      .style('fill', 'transparent')
      ;
  }
} // end of class