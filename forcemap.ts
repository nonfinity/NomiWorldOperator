
import * as nwo from './scripts/nwo_v001';
import * as d3 from 'd3';

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


export class forceMap {
  cfg: configSet;
  parent: d3.node;
  svg: { [key : string] : d3.node } = {
    _root     : undefined,
    hubs      : undefined,
    links     : undefined,
    shipments : undefined,
  }
  
  nodes: any;
  links: linkDef[];
  simulation: d3.forceSimulation;

  shipments: any;

  constructor(parent_id: string, cfg: configSet, world: nwo.World) {
    this.parent = d3.select(`#${parent_id}`);
    this.cfg = cfg
    

    this._world_update(world);

    this.simulation = d3.forceSimulation(this.nodes)
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(cfg.width/2, cfg.height/2))
      .force("link", d3.forceLink(this.links).strength(0.1))
      .on('tick', d => this._forceTick() ) // context is lost during the tick call and must be passed to be accessed
      ;

    
    this._svg_initialize();
    //this._svg_update();

    console.log(this);
  }

  update(world: nwo.World) {
    // update shipments underlier
    this.shipments = Object
      .values(world['shipments'])
      .map(d => ({
        world_id: d.id,
        current: d.current,
        distance: d.distance,
        source: d.origin.id,
        target: d.ending.id,
        })
      );
    
    // update shipments SVG elements
    this.svg.shipments
      .selectAll('rect')
      .data(this.shipments)
      .join(
        enter => enter
          .append('rect')
          .attr('class', 'shipment')
          .attr('height', 5)
          .attr('width', 5)
          .attr('rx', 2)
          .attr('ry', 2)
          .attr('x', d => this.nodes[d.source].x)
          .attr('y', d => this.nodes[d.source].y)
          ,
        update => update
          .attr('x', d => d3.interpolateNumber(this.nodes[d.source].x, this.nodes[d.target].x)(d.current / d.distance) - 4)
          .attr('y', d => d3.interpolateNumber(this.nodes[d.source].y, this.nodes[d.target].y)(d.current / d.distance) - 4)
          ,
        exit => exit
          .call(item => item.remove() )
          ,
        )
      ;
  }

  private _world_update(world: nwo.World) {
    this.nodes = this._format_node(world);
    this.links = this._format_link(world);
    
    this.shipments = Object
      .values(world['shipments'])
      .map(d => ({
        world_id: d.id,
        current: d.current,
        distance: d.distance,
        source: d.origin.id,
        target: d.ending.id,
        })
      );
    
  }

  private _forceTick() {
    if (this.svg !== undefined) {
      this.svg.hubs
        .selectAll('circle')
        .data(this.nodes)
        .join('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)

      this.svg.links
        .selectAll('line')
        .data(this.links)
        .join('line')
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

      
      // shipments are a whole different 'layer' and not involved in the force simulation

      // add some fancy viewport manipulation here so the whole thing zooms fluidly
    } // end of if
  }

  private _drag(simulation) {    
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

  private _svg_initialize(): void {
    this.svg._root =  this.parent
      .append("svg")
      .attr("viewBox", [0, 0, this.cfg.width, this.cfg.height])
      //.attr("width", cfg.width) //"100%")
      //.attr("height", cfg.height) //"100%")
      //.on('click', d=>console.log("clicky clack")) // why wont this do anything?!?!?
      ;
    
    // prep links group (first so it's on botom)
    this.svg.links = this.svg._root
      .append("g")
      .attr("class", "links")
      ;
    
    this.svg.links
      .selectAll('line')
      .data(this.links)
      .join(
        enter => enter
          .append("line")
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
        )
      ;

    // prep hubs group
    this.svg.hubs = this.svg._root
      .append("g")
      .attr("class", "hubs")
      ;
    
    this.svg.hubs
      .selectAll('circle')
      .data(this.nodes)
      .join(
        enter => enter
          .append('circle')
          .attr('r', 8)
          .attr("fill", "yellow")
          .attr("stroke", "black")
          .call(this._drag(this.simulation))
        )
      ;
    
    this.svg.shipments = this.svg._root
      .append("g")
      .attr("class", "shipments")
      ;
}

  private _format_node(world: nwo.World): any[] {
    /*
    let out = [];
    
    let home = world['hubs']
    for(let i in home) {
      out.push({world_id: home[i].id, name: home[i].name})
    }

    //console.log('-- format_node --')
    //console.log(out)
    //console.log(Object.values(world['hubs']).map(d => ({world_id: d.id, name: d.name})) )
    //return out;
    */
    return Object.values(world['hubs']).map(d => ({world_id: d.id, name: d.name}));
  }

  private _format_link(world: nwo.World): linkDef[] {
    /*
    let out: linkDef[] = [];

    let home = world['edges']
    for(let i in home) {
      //console.log(home[i].pointA.id);
      let tmp: linkDef = { source: home[i].pointA.id, target: home[i].pointB.id };
      out.push(tmp);
    }

    //console.log('-- format link --')
    //console.log(out)
    //console.log(Object.values(world['edges']).map(d => ({source: d.pointA.id, target: d.pointB.id})) )
    //return out;
    */
    return Object.values(world['edges']).map(d => ({source: d.pointA.id, target: d.pointB.id}))
  }

  private _svg_update(): void {
    
    // update hubs first
    /*
    this.svg.hubs
      .selectAll('circle')
      .data(this.nodes)
      .join(
        enter => enter
          .append('circle')
          .attr('r', 8)
          .attr("fill", "yellow")
          .attr("stroke", "black")
          .call(this._drag(this.simulation))
        //  ,
        //update => update
        //  ,
        //exit => exit
        //  .call(item => item.remove() )
        //  ,
        )
      ;
    */

    // updaing the links
    this.svg.links
      .selectAll('line')
      .data(this.links)
      .join(
        enter => enter
          .append("line")
          .attr("stroke", "blue")
          .attr("stroke-width", 2)
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
          ,
        update => update
          ,
        exit => exit
          .call(item => item.remove() )
          ,
        )
      ;
    
    //
    // update the shipments
    this.svg.shipments
      .selectAll('rect')
      .data(this.shipments)
      .join(
        enter => enter
          .append('rect')
          .attr('class', 'shipment')
          .attr('height', 4)
          .attr('width', 4)
          .attr('rx', 2)
          .attr('ry', 2)
          .attr('x', d => this.nodes[d.source].x)
          .attr('y', d => this.nodes[d.source].y)
          ,
        update => update
          ,
        exit => exit
          .call(item => item.remove() )
          ,
        )
      ;

      //this.simulation.alphaTarget(0.3).restart();

  }
}