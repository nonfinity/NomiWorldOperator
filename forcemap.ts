import * as nwo from './scripts/nwo_v0.0.02';
import * as d3 from 'd3';
import { tooltip } from './tooltip';

// Interface definitions
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
    shipSize: number,
  };
  interface linkSet {
    def: linkDef[],
    format: {
      size: {
        scale: d3.scale,
        domain: {
          min: number,
          max: number,
        },
      },
    },
  }

  interface hubDef {
    world_id: number,
    name: string,
    socket: hubSocket,
    x?: number,   // assigned by d3 at runtime
    y?: number,   // assigned by d3 at runtime
  };
  interface hubSocket {
    id: number,
    name: string,
    price: number,
    baseQty: number,
    invRatio: number,
    inventory: number,
  };
  interface hubSet {
    def: hubDef[],
    format: {
      size: {
        scale: d3.scale,
        domain: {
          min: number,
          max: number,
        }
      }
      color: {
        scale: d3.scale,
        domain: {
          min: number,
          max: number,
        },
      },
    },
  };
//

export class forceMap {
  cfg: configSet;
  world: nwo.World;
  parent: d3.node;
  svg: { [key : string] : d3.node } = {
    _root     : undefined,
    hubs      : undefined,
    links     : undefined,
    shipments : undefined,
  };
  ttips: { [key : string] : tooltip } = {
    hub       : undefined,
    edge      : undefined,
    shipment  : undefined,
  };
  
  nodes: hubSet;
  links: linkSet;
  simulation: d3.forceSimulation;

  shipments: any;
  itemName: string;

  hubColors = {
    min: '#FF0000',
    max: '#00FF00',
  };
  hColor; // hub color interpolator

  constructor(parent_id: string, cfg: configSet, world: nwo.World, itemName: string) {
    this.parent = d3.select(`#${parent_id}`);
    this.itemName = itemName;
    this.world = world;
    this.cfg = cfg;

    this.ttips.hub = new tooltip(this, this.parent, this.cfg, this._hubTipContents);
    this.ttips.shipment = new tooltip(this, this.parent, this.cfg, this._shipTipContents);

    this.hColor = d3.interpolate(this.hubColors.min, this.hubColors.max);
    

    this._world_update(world);

    this.simulation = d3.forceSimulation(this.nodes.def)
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(cfg.width/2, cfg.height/2))
      .force("link", d3.forceLink(this.links.def).strength(0.1))
      .on('tick', d => this._forceTick() )
      ;

    this._svg_initialize();
    this._svg_draw();

    console.log(this);
  }

  update(world: nwo.World) {
    this._prep_shipments(world);
    
    this._update_sockets(world)
    this._update_node_scales()

    this._svg_draw();
  } // end of update()

  private _world_update(world: nwo.World) {
    this._format_node(world);
    this._format_link(world);
    
    this._prep_shipments(world);
  }

  change_item(world: nwo.World, itemName: string) {
    // console.log(`changing from ${this.itemName} to ${itemName}`)
    this.itemName = itemName;
    // this._world_update(world);
    this.update(world);

    this._update_sockets(world)
    this._update_node_scales()
    
    // this.nodes = this._format_node(world);
    // this.simulation

    this._svg_draw();
  }

  private _forceTick() {
    if (this.svg !== undefined) {
      this.svg.hubs
        .selectAll('circle')
        .data(this.nodes.def)
        .join('circle')
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)

      this.svg.links
        .selectAll('line')
        .data(this.links.def)
        .join('line')
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)

      
      // shipments are a whole different 'layer' and not involved in the force simulation

      // add some fancy viewport manipulation here so the whole thing zooms fluidly?
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
    this.parent
      .style("position", "relative")
      ;

    this.svg._root =  this.parent
      .append("svg")
      .attr("viewBox", [0, 0, this.cfg.width, this.cfg.height])
      ;
    
    // prep links group (first so it's on botom)
    this.svg.links = this.svg._root
      .append("g")
      .attr("class", "links")
      ;

    // prep shipments group so it's above edges and below hubs
    this.svg.shipments = this.svg._root
      .append("g")
      .attr("class", "shipments")
      ;

    // prep hubs group
    this.svg.hubs = this.svg._root
      .append("g")
      .attr("class", "hubs")
      ;
  }

  private _svg_draw(): void {
    
    
    // bind and draw links
    this.svg.links
      .selectAll('line')
      .data(this.links.def)
      .join(
        enter => enter
          .append("line")
          .attr("stroke", "blue")
          .attr("stroke-opacity", "30%")
          .attr("stroke-width", (d) => {
            return `${this.links.format.size.scale(d.shipSize)}px`
             })
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y)
          ,
        update => update
          // no ability to update links at this point
          ,
        exit => exit
          // no ability to delete links at this point
          ,
      );
    
    //

    // draw the hubs
    this.svg.hubs
      .selectAll('circle')
      .data(d => {
        // console.log(`--- hub join --- item = ${this.nodes.def[0].socket.name}`);
        return this.nodes.def;
        })
      .join(
        enter => enter
          .append('circle')
          // .attr('r', 8)
          .attr('r', d => { 
            // console.log(`new hub ${d.name} has baseQty of ${d.socket.baseQty} for item ${d.socket.name} ... r = ${this.nodes.format.size.scale(d.socket.baseQty)}`);
            
            return this.nodes.format.size.scale(d.socket.baseQty)} 
            )
          .attr('fill', d => { return this.hColor(d.socket.invRatio / 2)})
          .attr("stroke", "black")
          .call(this._drag(this.simulation))
          .call(this.ttips.hub.assign, this.ttips.hub)
          ,
        update => update
          // change colors
          .attr(`r`, d => {
            // console.log(`edit hub ${d.name} has baseQty of ${d.socket.baseQty} for item ${d.socket.name} ... r = ${this.nodes.format.size.scale(d.socket.baseQty)}`);
            
            return this.nodes.format.size.scale(d.socket.baseQty);} )
          .attr('fill', d => this.hColor(d.socket.invRatio / 2) )
          ,
        exit => exit
          // no ability to delete hubs at this point
          ,
      );
    //

    // draw and update Shipments
    if(this.shipments !== undefined) {
      // update shipments SVG elements
      this.svg.shipments
        .selectAll('rect')
        .data(d => {
          // console.log(`--- shipment join ---`);
          // console.log(this.nodes.def)
          return this.shipments
          }, d => d.id)
        .join(
          enter => enter
            .append('rect')
            .attr('class', 'shipment')
            .attr('height', 5)
            .attr('width', 5)
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('x', d => this.nodes.def[d.origin_id].x)
            .attr('y', d => this.nodes.def[d.origin_id].y)
            .call(this.ttips.shipment.assign, this.ttips.shipment)
            ,
          update => update
            .transition()
              .duration(225)
              .attr('x', d => d3.interpolateNumber(this.nodes.def[d.origin_id].x, this.nodes.def[d.target_id].x)(d.current / d.distance) - 4)
              .attr('y', d => d3.interpolateNumber(this.nodes.def[d.origin_id].y, this.nodes.def[d.target_id].y)(d.current / d.distance) - 4)
            ,
          exit => exit
            .call(item => item.remove() )
            ,
          )
        ;
    } // end of if
    //
  }

  private _format_node(world: nwo.World): void {
    let out: hubSet = {
      def: [],
      format: {
        color: {
          scale: undefined,
          domain: {
            min: 0,
            max: 2,
          },
        },
        size: {
          scale: undefined,
          domain: {
            min: Infinity,
            max: -Infinity,
          }
        }
      },
    };
    
    for(let [key, value] of world.hubs) {
    //   let currSocket: hubSocket;

    //   for(let [sKey, sVal] of value.sockets) {
    //     if (sVal.item.name === this.itemName) {
    //       console.log(`assign socket to item ${this.itemName}`)
    //       currSocket = {
    //         id: sVal.id,
    //         name: sVal.item.name,
    //         price: sVal.LIP(),
    //         baseQty: sVal.baseQty,
    //         invRatio: sVal.invRatio(),
    //         inventory: sVal.inventory,
    //       }; 
    //     }
    //   } // end of socket loop


      // push hub definition to the set
      out.def.push({
        world_id: value.id,
        name: value.name,
        socket: undefined,
      });
    } // end of hub loop

    this.nodes = out;
    this._update_sockets(world)
    this._update_node_scales(out)
  }

  private _format_link(world: nwo.World): void {
    let out: linkSet = {
      def: [],
      format: {
        size: {
          domain: {
            min: Infinity,
            max: -Infinity,
          },
          scale: undefined,
        },
      },
    };
    let fmt = out.format.size

    // stroke range info
    let stroke = {
      min: 0.5,
      max: 3.5,
    };

    for(let [key, value] of world.edges) {
      if (value.shipSize < fmt.domain.min) { fmt.domain.min = value.shipSize }
      if (value.shipSize > fmt.domain.max) { fmt.domain.max = value.shipSize }
      
      out.def.push({ 
        source: value.pointA.id,
        target: value.pointB.id,
        shipSize: value.shipSize,
         })
    }

    fmt.scale = d3.scaleLinear()
      .domain([fmt.domain.min, fmt.domain.max]) // input range
      .range([stroke.min,  stroke.max])         //  output range
      ;

    this.links = out;
  }

  private _update_sockets(world: nwo.World) {
    // console.log(`--- update sockets ---`)
    // console.log(this.nodes);
    
    if (this.nodes !== undefined) {
      for (let n in this.nodes.def) {
        let node: hubDef = this.nodes.def[n]
        let socket: nwo.ItemSocket = world.getSocketByHubItem(
          world.getHubByID(node.world_id),
          world.getItemByName(this.itemName)
          )
        
        node.socket = {
          id: socket.item.id,
          name: socket.item.name,
          price: socket.LIP(),
          baseQty: socket.baseQty,
          invRatio: socket.invRatio(),
          inventory: socket.inventory,
        }
      }
    }
  }

  private _update_node_scales(nodes: hubSet = this.nodes): void {
    let fmt = nodes.format;
    let def = nodes.def;

    // format range info
    let size =  { min: 5,   max:  10,   };
    

    // update the hub size scale for this.itemName
    // it is based on the socket's baseQty
    for(let h in def) {
      // for(let i in def[h].sockets) {
        let val = def[h].socket;
        if(val.name === this.itemName) {
          if (val.baseQty < fmt.size.domain.min) { fmt.size.domain.min = val.baseQty }
          if (val.baseQty > fmt.size.domain.max) { fmt.size.domain.max = val.baseQty }
        }

      // } // end socket loop
    } // end hub loop

    fmt.size.scale = d3.scaleLinear()
      .domain([fmt.size.domain.min, fmt.size.domain.max])
      .range([size.min, size.max]);
  }

  private _prep_shipments(world: nwo.World) {
    // update shipments underlier
    // console.log(`--- prep shipments ---`)
    let step1 = world.log.getLastShipmentTick();
    if(step1 !== undefined) {
      
      let step2 = d3.group(step1, d => d.item_name)
      if(step2 !== undefined) {
        
        let step3 = step2.get(this.itemName)
        if(step3 !== undefined) {
          this.shipments = step3;
        }
      }
    }

  }

  private _shipTipContents(d: d3.datum): string[] {
    return [
      `Shipment: ${d.id}`,
      `Contents: ${d.quantity} ${d.item_name}`,
      `${percent.format(d.current / d.distance)} to ${d.target_name}`
    ]
  }

  private _hubTipContents(d: d3.datum): string[] {
    let pg = this.parent_graph;  // when called, the context is this = a tooltip class object

    let hub: nwo.Hub  = pg.world.getHubByID(d.world_id);
    let item: nwo.Item = pg.world.getItemByName(pg.itemName);
    let socket: nwo.ItemSocket = pg.world.getSocketByHubItem(hub, item)

    return [
      `${d.name}`,
      `${pg.itemName}: ${currency.format(socket.LIP())}`,
      `Inventory: ${socket.inventory} (${percent.format(socket.invRatio())})`
    ]

  }
}


// not part of the class itself, but used within.
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',

  // These options are needed to round to whole numbers if that's what you want.
  minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})