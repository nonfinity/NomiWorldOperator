/**
 * this is the class that builds and maintains the inspector panel
 */
import * as nwo from './nwo_v0.0.02';

export class inspector {
  // class member declarations
    readonly parent_id: string;
    private _target: any;

    private _typeCallbacks: { [key: string] : (self: inspector) => void } = {
      'Hub'         : this.loader_hub,
      'Edge'        : this.loader_edge,
      'ItemSocket'  : this.loader_socket,
      'Item'        : this.loader_item,
      'World'       : this.loader_world,
      'Shipment'    : this.loader_shipment,

      'forceMap'    : this.loader_tbd,
      'lineChart'   : this.loader_tbd,
    }

    private _rowCallbacks: { [key: string] : (self: inspector, title: string, thing) => void } = {
      'String'  : this.row_string,
      'Number'  : this.row_number,
      'Map'     : this.row_map,

      'Hub'     : this.row_linkObj,
      'World'   : this.row_linkObj,
      'Item'    : this.row_linkObj,
    }

    private readonly DOM: { [key : string] : HTMLDivElement } = {
      _root       : undefined,
      head        : undefined,
      rows        : undefined,
      head_id     : undefined,
      head_title  : undefined,
      head_descr  : undefined,
    };
  //

  constructor(parent: string) {
    this.DOM._root = <HTMLDivElement>document.getElementById(parent);
    this.prep_head();
    this.prep_rows();
  }

  // public class methods
    clear(): void {
      // clear all text from the head
      for(let i of this.DOM.head.children) {
          i.innerHTML = ``;
      }

      while (this.DOM.rows.firstChild) {
        this.DOM.rows.removeChild(this.DOM.rows.lastChild);
      }

      this.update_head(``,`Nothing Selected`, ``)
    }

    load(obj: any): boolean {
      let didLoad: boolean = false
      // go through testing of the object to load it
      this.target = obj;

      let tgtType = this.target.constructor.name

      // console.log(`--- inspector.load ---`)
      // console.log(`loading object of type ${typeof obj} and name of ${obj.constructor.name}`)

      if ( Object.keys(this._typeCallbacks).includes(tgtType) ) {
        // console.log(`trying callback`)
        this.clear();
        this._typeCallbacks[tgtType](this);
        didLoad = true;
      } else {
        this.update_head(`#`, `Cannot load`, `Invalid object type ${tgtType}`)
      }


      // console.log(`/// inspector.load ///`)
      return didLoad;
    }
  //

  // formatting specific logics
    private prep_head() {
      this.DOM.head = document.createElement(`div`);
      this.DOM._root.appendChild(this.DOM.head);

      this.DOM.head.setAttribute(`id`, `ins_head`)
      
      this.DOM.head_title = addDivTo(this.DOM.head, `ins_head_title`);
      this.DOM.head_id = addDivTo(this.DOM.head, `ins_head_objID`);
      this.DOM.head_descr = addDivTo(this.DOM.head, `ins_head_descr`);
    }

    private prep_rows() {
      this.DOM.rows = addDivTo(this.DOM._root, `ins_rows`);
    }

    private update_head(id: string, title: string, descr: string) {
      this.DOM.head_id.innerText = id
      this.DOM.head_title.innerText = title
      this.DOM.head_descr.innerText = descr
    }
  //

  // loader callback functions
    private loader_lister(self: inspector) {
      let rowType: string;
      Object.entries(self.target).forEach(([key, value]) => {
        let keyAdj: string = key;
        let valAdj: any = value;

        if(value === undefined) {
          valAdj = 'Undefined';
        }

        if (keyAdj.charAt(0) == '_') {
          keyAdj = keyAdj.substring(1)
        }

        rowType = valAdj.constructor.name

        console.log(`element ${key} (${keyAdj}) has type ${rowType}`)
        if ( Object.keys(self._rowCallbacks).includes(rowType) ) {
          self._rowCallbacks[rowType](self, keyAdj, valAdj);
        }
      })
    }

    private loader_hub(self: inspector) {
      self.update_head(
        self.target.id.toString(),
        self.target.name,
        'Hub'
      )

      self.loader_lister(self);
    }

    private loader_edge(self: inspector) {
      self.update_head(
        self.target.id.toString(),
        self.target.name,
        'Edge'
      )

      self.loader_lister(self);
    }

    private loader_socket(self: inspector) {
      self.update_head(
        self.target.id.toString(),
        self.target.name,
        'ItemSocket'
      )

      self.loader_lister(self);
    }

    private loader_item(self: inspector) {
      self.update_head(
        self.target.id.toString(),
        self.target.name,
        'Item'
      )

      self.loader_lister(self);
    }

    private loader_world(self: inspector) {
      self.update_head(
        self.target.id.toString(),
        self.target.name,
        'World'
      )

      self.loader_lister(self);
    }

    private loader_shipment(self: inspector) {
      self.update_head(
        self.target.id.toString(),
        self.target.name,
        'Shipment'
      )

      self.loader_lister(self);
    }

    private loader_tbd(self: inspector) {}
  //

  // row type callback functions
    prep_row(parent: HTMLDivElement, title: string): HTMLDivElement {
      let label: HTMLDivElement = document.createElement(`div`);
      let value: HTMLDivElement = document.createElement(`div`);

      label.setAttribute(`class`, `ins_row_label`)
      label.innerText = title;

      value.setAttribute(`class`, `ins_row_value`)

      parent.appendChild(label);
      parent.appendChild(value);

      return value
    }

    row_string(self: inspector, title: string, thing: string) {
      // console.log(`** row_string() **`)
      let value = self.prep_row(self.DOM.rows, title);

      let box: HTMLInputElement = document.createElement(`input`);
          box.setAttribute(`type`, `text`);
          box.setAttribute(`value`, thing)
          box.setAttribute(`readonly`, ``)
      value.appendChild(box);
    }

    row_number(self: inspector, title: string, thing: number) {
      // console.log(`** row_number() **`)
      let value = self.prep_row(self.DOM.rows, title);

      let box: HTMLInputElement = document.createElement(`input`);
          box.setAttribute(`type`, `text`);
          box.setAttribute(`value`, thing.toString())
          box.setAttribute(`readonly`, ``)
      value.appendChild(box);
    }

    row_linkObj(self: inspector, title: string, thing: nwo.Hub) {
      // console.log(`** row_obj() **`)
      let value = self.prep_row(self.DOM.rows, title);

      let link: HTMLAnchorElement = document.createElement(`a`);
          link.setAttribute(`href`, `#`)
          link.innerHTML = thing.name
          link.addEventListener(`click`, e => self.load(thing) )

      value.appendChild(link);
    }

    row_map(self: inspector, title: string, thing: Map<any, any>) {
      let subhead: HTMLDivElement = document.createElement(`div`);
      let label: HTMLDivElement = document.createElement(`div`);

      subhead.setAttribute(`class`, `ins_row_subhead`)
      self.DOM.rows.appendChild(subhead);

      label.innerText = title;
      subhead.appendChild(label);

      for(let [key, value] of thing) {
        let r: HTMLDivElement = document.createElement(`div`);
            r.setAttribute(`class`,`test123`)
        
        let link: HTMLAnchorElement = document.createElement(`a`);
          link.setAttribute(`href`, `#`)
          link.innerHTML = value.name
          link.addEventListener(`click`, e => self.load(value) )

        r.appendChild(link);
        subhead.appendChild(r);
      }
    }
  //

  // class getter/setters
    get target() { return this._target; }
    set target(value: any) {
      this._target = value;
    }
  //

}

function addDivTo(parent: HTMLDivElement, DIVid?: string, DIVclass?: string, defaultText?: string): HTMLDivElement {
  let out: HTMLDivElement = document.createElement(`div`);

  if( DIVid !== undefined) {
    out.setAttribute(`id`, DIVid);
  }

  if( DIVclass !== undefined) {
    out.setAttribute(`class`, DIVclass);
  }

  if( defaultText !== undefined) {
    out.innerText = defaultText;
  }

  parent.appendChild(out);
  return out;
}