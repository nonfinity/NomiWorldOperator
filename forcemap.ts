
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
  svg: d3.node;
  
  nodes: any;
  links: linkDef[];
  simulation: d3.forceSimulation;

  constructor(parent_id: string, cfg: configSet, world: nwo.World) {
    this.parent = d3.select(`#${parent_id}`);
    this.svg = this._make_svg(this.parent, cfg);
    this.cfg = cfg

    this.nodes = this._format_node(world);
    this.links = this._format_link(world);

    this.simulation = d3.forceSimulation(this.nodes)
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(cfg.width/2, cfg.height/2))
      .force("link", d3.forceLink(this.links).strength(0.1))
      .on('tick', d => this._forceTick() ) // context is lost during the tick call and must be passed to be accessed
      ;

    this._render_chart();
  }

  private _render_chart(): void {
    
    // -----------------------
    // MAKE THE CHARTING YAH
    // -----------------------
    
    // add the links first so they're behind the hubs
    this.svg
      .append("g")
      .attr("class", "links")
      //add formatting
      .attr("stroke", "black")
      .selectAll("line")
      .data(this.links)
      .join("line")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
      ;

    // add hubs
    this.svg
      .append("g")
      .attr("class", "nodes")
      // add formatting
      .selectAll('circle')
      .data(this.nodes)
      .join('circle')
        .attr('r', 8)
        .attr("fill", "yellow")
        .attr("stroke", "black")
        .call(this._drag(this.simulation))
      ;
  }

  private _forceTick() {
    //console.log('ticked!');
    //console.log(this.parent);
    if (this.svg !== undefined) {
      this.svg
        .select('g.nodes')
        .selectAll('circle')
        .data(this.nodes)
        .join('circle')
        //.attr('r', 3)
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)

      this.svg
        .select('g.links')
        .selectAll('line')
        .data(this.links)
        .join('line')
        
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      // add some fancy viewport manipulation here so the whole thing zooms fluidly
    }
  }

  private _drag(simulation) {    
    //console.log("dragging");
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

  private _make_svg(parent: d3.node, cfg: configSet): d3.node {
    return parent
      .append("svg")
      .attr("viewBox", [0, 0, cfg.width, cfg.height])
      //.attr("width", cfg.width) //"100%")
      //.attr("height", cfg.height) //"100%")
      //.on('click', d=>console.log("clicky clack")) // why wont this do anything?!?!?
      ;
}

  private _format_node(data): any[] {
    let out = [];
    
    let home = data['hubs']
    for(let i in home) {
      out.push({world_id: home[i].id, name: home[i].name})
    }

    return out;
  }

  private _format_link(data): linkDef[] {
    let out: linkDef[] = [];

    let home = data['edges']
    for(let i in home) {
      //console.log(home[i].pointA.id);
      let tmp: linkDef = { source: home[i].pointA.id, target: home[i].pointB.id };
      out.push(tmp);
    }

    return out;
  }
}