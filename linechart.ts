import * as nwo from './scripts/nwo_v0.0.02';
import * as d3 from 'd3';


// interface chartData {number: nwo.logRow[]};
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
  interface scale {
    domainMin: number,
    domainMax: number,
    rangeMin: number,
    rangeMax: number,
  };
// 

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

  hubSet: number[] = [];
  data: d3.InternMap;
  recordName: string;
  itemName: string;
  colors = d3.scaleOrdinal(d3.schemeCategory10);

  scaleInfo: { x: scale, y: scale };
  xScale: d3.node;
  yScale: d3.node;
  xAxis: d3.node;
  yAxis: d3.node;
  
  line: d3.line;
  

  constructor(parent_id: string, cfg: configSet, world: nwo.World, itemName: string, recordName: string) {
    this.parent = d3.select(`#${parent_id}`);
    this.recordName = recordName;
    this.itemName = itemName;
    this.cfg = cfg;

    for(let i in world.hubs) {
      this.hubSet.push(world.hubs[i].id);
    }

    this.scaleInfo = {
      x: {
        domainMin: 1,
        domainMax: 2,
        rangeMin:  this.cfg.margin.left,
        rangeMax:  this.cfg.width - this.cfg.margin.right,
      },
      y: {
        domainMin: 0,
        domainMax: 1,
        rangeMin:  this.cfg.height - this.cfg.margin.bottom,
        rangeMax:  this.cfg.margin.top,
      }
    };
    
    this._world_update(world);
    this._data_prep();


    this._initialize_svg();

    console.log(this);
  }

  update(world: nwo.World) {
    this._world_update(world);
    this._data_prep();

    // console.log('--- world.update ---')
    // console.log(this.data);

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
          .style("stroke", "black")
          ,
        update => update
          .attr('x1', d => this.xScale(d))
          .attr('x2', d => this.xScale(d))
          .attr('y1', this.cfg.margin.top)
          .attr('y2', this.cfg.height - this.cfg.margin.bottom)
          ,
        exit => exit
          .call(item => item.remove() )
          ,
        )
      ;

    if(this.data !== undefined) {
      this.svg.chartlines
        .selectAll('path')
        .data(this.data.get(this.itemName))
        .join(
          enter => enter
            .append('path')
            .attr('class', 'chartline')
            .attr('d', ([, d]) => this.line(d))
            .style('stroke', (d, i) => this.colors(d[i]))
            .style('stroke-width', 2)
            .style('fill', 'transparent')
            ,
          update => update
            .attr('d', ([, d]) => this.line(d))
            ,
          exit => exit
            .call(item => item.remove() )
            ,
          )
        ;
    }
    // console.log('--- end of update ---');
  }

  change_item(world: nwo.World, itemName: string) {
    this.itemName = itemName;
    this.update(world);
  }

  private _world_update(world: nwo.World) {
    let tmp = world.log.getLastSocketTick();


    // console.log('-- socketTicks --');
    // console.log(world.log.socketTicks);
    // console.log('-- ------------- --');
    if(tmp !== undefined) {
      let recHome: nwo.socketTickRecord[] = []
      world.log.socketTicks.forEach( (value, key) => {
        recHome.push(...value);
      })
      
      // console.log('-- recHome --');
      // console.log(recHome);
      // console.log('-- ------------- --');
      this.data = d3.group(recHome, d => d.item_name, d=> d.hub_name);
    }
    // console.log('-- this.data --');
    // console.log(this.data);
    // console.log('-- --------- --');

    // update scaleInfo
    this._set_scales(world.time);
    // console.log('-- scale check --')
    // console.log(this.xScale(0))
    // console.log('-- ---------- --')
  }

  private _data_prep() {

    // determine the scales based on this.data
    this.xScale = d3.scaleLinear(
      [this.scaleInfo.x.domainMin, this.scaleInfo.x.domainMax],
      [this.scaleInfo.x.rangeMin,  this.scaleInfo.x.rangeMax] );
    this.yScale = d3.scaleLinear(
      [this.scaleInfo.y.domainMin, this.scaleInfo.y.domainMax],
      [this.scaleInfo.y.rangeMin,  this.scaleInfo.y.rangeMax] );
    // console.log('--- xScale ---');
    // console.log(this.xScale(1));
    // console.log('--- ------ ---');


    // set axis based on scales
    this.xAxis = d3.axisBottom(this.xScale).ticks(this.cfg.width / 40)
    this.yAxis = d3.axisLeft(this.yScale).ticks(this.cfg.height / 30)

    // refresh line based on scales
    this.line = d3
      .line()
      .x(d => {
          // console.log('--- line.x ---');
          // console.log(d);
          // console.log(`x: ${d.time}, y: ${d.LIP} ==> x:${this.xScale(d.time)}, y: ${this.yScale(d.LIP)}`);
          // console.log(`x: ${d.time}, y: ${d[this.recordName]} ==> x:${this.xScale(d.time)}, y: ${this.yScale(d[this.recordName])}`);
          // console.log('--- ------ ---');
          return this.xScale(d.time)
        })
      .y(d => this.yScale(+d[this.recordName]))
      // .y(d => {
      //   // console.log(`x: ${d.time}, y: ${d[this.recordName]} ==> x:${this.xScale(d.time)}, y: ${this.yScale(d[this.recordName])}`);
      //   return this.yScale(d.LIP);
      //   })
      .curve(d3.curveLinear);
  }

  private _set_scales(time: number): void {
    this.scaleInfo.y.domainMin = 0;
    this.scaleInfo.x.domainMin = 1;
    
    // set X domain max
    let xMin: number = 2
    this.scaleInfo.x.domainMax = Math.max(xMin, time);

    // set Y domain max from LIP values
    let yExtra: number = 0.15;
    let yMax: number = 5;

    if(this.data !== undefined) {
      let dSet = this.data.get(this.itemName);
      if (dSet !== undefined) {
        this.data.get(this.itemName).forEach( (value, key) => {
          value.forEach( (rVal, rKey) => {
            if(rVal[this.recordName] > yMax) {
              yMax = rVal[this.recordName];
            }
          }, this);
        }, this);
      }
      this.scaleInfo.y.domainMax = yMax * (1 + yExtra);
    }
  }


  private _initialize_svg(): void {
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

/**
 *  TRASH BIN
 */

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