/**
 * Tooltip Class
 * this is used to easily add a tooltip to a D3 Graph
 */
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

interface datumCallback { (datum: d3.datum): string[] }

export class tooltip {

  id: string = undefined;
  cfg: configSet = undefined;
  callback: datumCallback = undefined;
  parent_graph = undefined;

  parts: { [key : string] : d3.node } = {
    parent    : undefined,
    _root     : undefined,
    holder    : undefined,
    style     : undefined,
    content   : undefined,
  };


  constructor(parent_graph, parent: d3.node, cfg: configSet, callback: datumCallback) {
    this.id = genUniqueId();
    this.cfg = cfg;
    this.callback = callback;
    this.parts.parent = parent;
    this.parent_graph = parent_graph;

    // console.log(`tooltip constructor: this.id = ${this.id}`)
    console.log(this);

    this._initialize();
  }

  private _initialize(): void {
    this.parts._root = this.parts.parent
      .append("div")
      .attr("id", `root-${this.id}`)
      .style("position", "relative")
    
    // this.tooltip._root = this.parent
    this.parts.holder = this.parts._root
      .append("div")
      .attr("id", `ttip-${this.id}`)
      .attr("class", "tooltip")
      .style("display","none;")
      ;
    
    this.parts.style = this.parts.holder
      .append("style")
      .text(`
        div#ttip-${this.id} {
          bix-sizing: border-box;
          position: absolute;
          display: none;
          left: -100000px;
          padding: 0.2em 0.4em;
          font-family: sans-serif;
          font-size: 0.8em;
          color: #333;
          background-color: #fff;
          border: 1px solid #333;
          border-radius: 4px;
          pointer-events: none;
          z-index: 1;
        }
        div#text-${this.id} p {
          margin: 0;
        }`)
        ;
    
    this.parts.content = this.parts.holder
      .append("div")
      .attr("id", `text-${this.id}`)
      ;
      
    
  }

  assign(selectionGroup: d3.selectionGroup, self: tooltip): void {
    selectionGroup.each( function() {
      d3.select(this)
        .on("mouseover.tooltip",  handleMouseOver)
        .on("mousemove.tooltip",  handleMouseMove)
        .on("mouseleave.tooltip", handleMouseLeave)
    });

    function handleMouseOver(event, d) {
      let strContents: string[] = self.callback(d)
      setContents(strContents);
      showToolTip();
    }

    function handleMouseMove(event, d) {
      let [mouseX, mouseY] = d3.pointer(event);
      setPosition(mouseX, mouseY);
    }

    function handleMouseLeave(event, d) {
      hideToolTip();
    }
  
    function showToolTip(): void { 
      // console.log(`--- showToolTip ---`);
      // console.log(self);
      self.parts.holder.style("display", "block"); 
      }
    function hideToolTip(): void { self.parts.holder.style("display", "none"); }

    function setPosition(mouseX, mouseY) {
      let posAdj = 10;
      let stylePos = {
        'top'     : 'initial',
        'left'    : 'initial',
        'right'   : 'initial',
        'bottom'  : 'initial',
      }

      // if( mouseY < home.cfg.height / 2) { stylePos.top    = `${mouseY + posAdj}px`; }
      if( mouseX < self.cfg.width  / 2) { stylePos.left   = `${mouseX + posAdj}px`; }
      if( mouseX > self.cfg.width  / 2) { stylePos.right  = `${self.cfg.width  - mouseX + posAdj}px`; }
      // if( mouseY > this.cfg.height / 2) { stylePos.bottom = `${this.cfg.height - mouseY + posAdj}px`; }
      stylePos.top    = `${mouseY + posAdj}px`;

      for(let key in stylePos) {
        // console.log(`style set( ${key} --> ${stylePos[key]})`);
        self.parts.holder.style(key, stylePos[key]);
      }

    }

    function setContents(vals: string[]) {
      // remove anything existing
      self.parts.content.selectAll("p")
        .data(vals)
        .join("p")
          .text(d => d)
        ;
    }
  }
}

function genUniqueId(): string {
  const dateStr = Date
    .now()
    .toString(36) // convert num to base 36 and stringify
    .slice(4,8)
    ;


  const randomStr = Math
    .random()
    .toString(36)
    .substring(2, 6)  // start at index 2 to skip decimal point
    ;

  return `${dateStr}${randomStr}`;
}