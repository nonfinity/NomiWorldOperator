/**
 * Make good big instruction being here, yah.
 */
// -------------------------------------------------------------------------------------------------------------------------------


/**
 * define the Object type being logged
 */
interface logRow {
  time: number,
  hub_id: number,
  hub_name: string,
  item_id: number,
  item_name: string,
  inventory: number,
  invRatio: number,
  price: number,
}


/**
 * the World is the whole simulation model
 */
export class World {
  time:         number                        = 0;
  hubs:         { [key: string]: Hub; }       = {};
  edges:        { [key: string]: Edge; }      = {};
  items:        { [key: string]: Item; }      = {};
  shipments:    { [key: string]: Shipment; }  = {};

  keys = {
    hubs: 0,
    edges: 0,
    items: 0,
    shipments: 0,
  };

  // logging setup
  logEnable: boolean = true;
  log = {
    environment: {
      hubs: {},
      edges: {},
      items: {},      
    },
    ticks: [],
    shipments: [],
  };

  /**
   * adds a new Hub to the World
   */
  addHub(name: string): Hub {
    let x = new Hub(this, this.keys.hubs, name);
    this.keys.hubs += 1;

    // add new hub logging
    this._register_Hub(x);
    return x;
  }
  
  /**
   * adds a new Edge between two Hubs
   */
  addEdge(pointA: Hub, pointB: Hub, distance: number, cost: number, shipSize: number): Edge {
    let x = new Edge(this.keys.edges, pointA, pointB, distance, cost, shipSize);
    this.keys.edges += 1;
    
    // add new edge logging
    this._register_Edge(x);
    return x;
  }

  addItem(name: string, minReserve: number, basePrice: number, swing: number, k_exp: number = 1): Item {
    let x: Item = new Item(this, this.keys.items, name, minReserve, basePrice, swing, k_exp);
    this.keys.items += 1;

    // add new edge logging
    this._register_Item(x);
    return x;
  }

  addShipment(origin: Hub, ending: Hub, item: Item, distance: number, quantity: number): Shipment {
    let x: Shipment = new Shipment(this.keys.shipments, origin, ending, item, distance, quantity);
    this.keys.shipments += 1;

    this._register_Shipment(x);
    return x;
  }

  
  _register_Hub(hub: Hub): void {
    this.hubs[hub.id] = hub;

    this.log.environment.hubs[hub.id] = {
      id: hub.id,
      name: hub.name,
    }
  }
  _register_Item(item: Item): void {
    this.items[item.id] = item;

    this.log.environment.items[item.id] = {
      id:           item.id,
      name:         item.name,
      basePrice:    item.basePrice,
      minReserve:   item.minReserve,
      swing :       item.swing,
      k_exp:        item.k_exp,
    }
  }
  _register_Edge(edge: Edge): void {
    this.edges[edge.id] = edge;
    
    // register with Hubs also
    edge.pointA.edges.push(edge);
    edge.pointB.edges.push(edge);

    this.log.environment.edges[edge.id] = {
      id: edge.id,
      pointA: { id: edge.pointA.id, name: edge.pointA.name },
      pointB: { id: edge.pointB.id, name: edge.pointB.name },
      cost: edge.cost,
      distance: edge.distance,
      shipSize: edge.shipSize,
    }
  }
  _register_Shipment(shipment: Shipment): void {
    this.shipments[shipment.id] = shipment;

    // register at ending Hub?

    // currently not logging shipments to World.log
  }

  /**
   * a tick is a single unit of time in the primary simulation loop
   */
  tick(): void {
    this.time += 1;

    // perform production and consumption
    for(let i in this.hubs) {
      this.hubs[i].tick();
    }

    // process shipments in transit
    for(let i in this.shipments) {
      this.shipments[i].tick();
      
      // filter out delivered shipments
      //this.shipments = this.shipments.filter(each => !each.isDelivered);
      if (this.shipments[i].isDelivered) {
        delete this.shipments[i];
      }
    }

    // launch shipments if needed
    for(let i in this.edges) {
      this.edges[i].tick();
    }

    this.logging();
    //console.log(this);
  }

  logging(): void {
    if (this.logEnable) {
      
      // log hub & socket info
      for (let i in this.hubs) {
        for (let j in this.hubs[i].sockets) {
          let h = this.hubs[i]
          let tmp: logRow = {
            time: this.time,
            hub_id: h.id,
            hub_name: h.name,
            item_id: h.sockets[j].item.id,
            item_name: h.sockets[j].item.name,
            inventory: h.sockets[j].inventory,
            invRatio: h.sockets[j].invRatio(),
            price: h.sockets[j].LIP(),
          }

          this.log.ticks.push(tmp);
        }
      }
      // log shipment info
    }
  }


}

/**
 * a Hub is a single economic point. Be it shop, city, planet, or camp
 */
export class Hub {
  /**
   * the world assigned identifier
   */
  id:           number;
  /**
   * the World in which this Hub exists
   */
  parentWorld:  World;
  /**
   * the text name of this Hub
   */
  name:         string;
  /**
   * the dictionary of ItemSockets at this Hub. Come back and figure out the correct type
   */
  sockets:       { [key: string]: ItemSocket; } = {};
  /**
   * the array of Edges connected to this Hub
   */
  edges:        Edge[] = [];
  /**
   * the array of shipments ending at this Hub
   */
  shipments:    Shipment[] = [];

  constructor(world:World, id: number, name: string) {
    this.parentWorld = world;
    this.name = name;
    this.id = id;
  }

  /**
   * The main doer fuction
   */
  tick(): void {
    
    // tick the sockets to update inventories
    for(let i in this.sockets) {
      this.sockets[i].tick()
    }
  }
  
  /**
   * add a new ItemSocket to this Hub
   */
  addSocket(item:Item, production: number, consumption: number, inventory?: number, baseQty?: number): void {
    new ItemSocket(this, item, production, consumption, inventory, baseQty);
  }
}

/**
 * an Item is a category of thing to be tracked. Ex: wood, troops, fuel, influence
 */
export class Item {
  /**
   * the world assigned identifier
   */
  id:           number;
  /**
   * the World this Item exists in
   */
  parentWorld:    World;
  /**
   * the text name of this Item
   */
  name:           string;
  /**
   * indicates the minimum inventory ratio at which a shipment can be sent. Values below
   * minReserve are in a sort of emergency hoarding mode.
   */
  minReserve:    number;
  /**
   * the "default" price of the good when inventory levels are at their base quantity
   */
  basePrice:      number;
  /**
   * the width in % this Item's price band around basePrice. 10% = 90% to 110% of basePrice
   */
  swing:          number;
  /**
   * the exponent of the price response function. 1 for linear. Volatile is k_exp < 1. Stable is k_exp > 1.
   * Values will be rounded according to this formula 1/3 + multiples of 1/7.5
   */
  k_exp:          number;

  constructor(world: World, id: number, name: string, minReserve, basePrice: number, swing: number, k_exp: number = 1) {
    this.parentWorld = world;
    this.name = name;
    this.id = id;
    this.minReserve = minReserve;

    let errBase: string = `Error: Cannot create socket for Item ${name}!`;
    let errCause: string = ``;
    
    // basePrice : input validation
    switch(true) {
      case (basePrice <= 0):
        errCause = `Item.basePrice must be greater than zero. Given value = ${basePrice}`;
        throw Error(errBase + '' + errCause);
        break;
      
      default:
        this.basePrice = basePrice;
    }

    // swing : input validation
    switch(true) {
      case (swing < 0 || swing >= 1):
        errCause = `Item.swing must be [0-1): between 0 inclusive and 1 exclusive. Given value = ${basePrice}`;
        throw Error(errBase + '' + errCause);
        break;
      
      default:
        this.swing = swing;
    }

    // k_exp : input validation
    switch(true) {
      case (k_exp < 0):
        errCause = `Item.k_exp must be greater than zero. Given value = ${k_exp}`;
        throw Error(errBase + '' + errCause);
        break;
      
      default:
        let tmp: number = (k_exp - (1/3)) * 7.5; // unwind values so it can be rounded
        this.k_exp = Math.round(tmp) / 7.5 + (1/3); // now round the hell out of it  
        this.k_exp = Math.max(1/3, this.k_exp);
        //console.log(`input = ${k_exp}. \n tmp = ${tmp} \n output = ${this.k_exp}`)
    }
  }
}

/**
 * an ItemSocket connects Items and Hubs. It is the many-many relationship between them
 */
export class ItemSocket {
  /**
   * the Hub to which this ItemSocket belongs
   */
  parentHub:    Hub;
  /**
   * the Item which this ItemSocket is for
   */
  item:         Item;
  /**
   * the current quantity of Item at this ItemSocket
   */
  inventory:    number;
  /**
   * how much Item is produced every tick
   */
  production:   number;
  /**
   * how much Item is consumed every tick
   */
  consumption:  number;
  /**
   * the "satisfactory" amount of inventory such that the LIP = the Item's base price
   */
  baseQty:      number;

  constructor(parentHub: Hub , item: Item, production: number, consumption: number, 
              inventory: number = 2 * consumption, baseQty: number = 2 * consumption ) {
    this.parentHub = parentHub;
    this.item = item;

    let errBase: string = `Error: Cannot create socket for Item ${item.name} on Hub ${parentHub.name}!`;
    let errCause: string = ``;

    // World : input validation
    switch(true) {
      case (parentHub.parentWorld !== item.parentWorld):
        errCause = `They are in different worlds`;
        throw Error(errBase + ' ' + errCause);
        break;
      default:
        this.production = production;
    }

    // production : input validation
    switch(true) {
      case (production < 0):
        errCause = `Production must be greater than or equal to zero. Given value = ${production}`;
        throw Error(errBase + ' ' + errCause);
        break;
      default:
        this.production = production;
    }
    
    // consumption : input validation
    switch(true) {
      case (consumption < 0):
        errCause = `Consumption must be greater than or equal to zero. Given value = ${consumption}`;
        throw Error(errBase + ' ' + errCause);
        break;
      default:
        this.consumption = consumption;
    }

    // inventory : input validation
    switch(true) {
      case (inventory < 0):
        errCause = `Inventory must be greater than or equal to zero. Given value = ${inventory}`;
        throw Error(errBase + ' ' + errCause);
        break;
      default:
        this.inventory = inventory;
    }

    // baseQty : input validation
    switch(true) {
      case (baseQty < 0):
        errCause = `BaseQty must be greater than or equal to zero. Given value = ${baseQty}`;
        throw Error(errBase + ' ' + errCause);
        break;
      default:
        this.baseQty = baseQty;
    }

    // on creation register yourself with your parent Hub
    //parentHub.sockets.push(this);
    parentHub.sockets[item.name] = this;
  }

  /**
   * the main doer function
   */
  tick(): void {
    this.inventory += this.production - this.consumption;
    this.inventory = Math.max(0, this.inventory);
  }

  /**
   * the ratio of current inventory to baseQty
   */
  invRatio(): number {
    return this.inventory / this.baseQty;
  }

  /**
   * LIP = Locational Item Price. The price of Item at this specific Hub.
   * Prices follow ths function y = -1 * swing * basePrice * (invRatio - 1)^k_exp + basePrice
   */
  LIP(): number {
    let out: number = 0;

    // y = -sb(x-1)^k + b
    // apparently Javascript chokes on exponentiation when the base is negative and the exponent is not an integer
    // therefore we're going to do some fancy footwork
    let r: number = this.invRatio()
    if(r-1 >= 0) {
      out = -1 * this.item.swing * this.item.basePrice * Math.pow(r - 1, this.item.k_exp) + this.item.basePrice;
    } else {
      let tmp_r: number = 2 - r; // or (1-r) + r ... to mirror the value around 1
      let tmp_p: number = -1 * this.item.swing * this.item.basePrice * Math.pow(tmp_r - 1, this.item.k_exp) + this.item.basePrice;

      out = 2 * this.item.basePrice - tmp_p; // or (base - tmp) + base ... to mirror the value around basePrice
    }

    

    return out;
  }
}

/**
 * an Edge is a bidirectional connection between two Hubs
 */
export class Edge {
  /**
   * the world assigned identifier
   */
  id:           number;
  /**
   * the world in which this Edge exists
   */
  parentWorld:  World;
  /**
   * one of the two Hubs connected by this Edge
   */
  pointA:       Hub;
  /**
   * one of the two Hubs connected by this Edge
   */
  pointB:       Hub;
  /**
   * the time in ticks it takes to travel along this Edge
   */
  distance:     number;
  /**
   * The price difference required between the two hubs for a Shipment to travel this Edge. 
   */
  cost:         number;
  /**
   * This maximum shipment size allowed on this edge
   */
  shipSize:     number;

  constructor(id: number, pointA: Hub, pointB: Hub, distance: number, cost: number, shipSize: number) {
    this.id = id;

    let errBase: string = `Error: Cannot create Edge!`;
    let errCause: string = ``;
    
    // pointA & B : input validation
    switch(true) {
      case(pointA === undefined || pointA === null):
        errCause = `pointA is undefined or null`;
        throw Error(errBase + ' ' + errCause);
        break;
      
      case(pointB == undefined || pointB === null):
        errCause = `pointB is undefined or null`;
        throw Error(errBase + ' ' + errCause);
        break;
      
      default:
        this.pointA = pointA;
        this.pointB = pointB;
    }

    // update errBase to be more helpful
    errBase = `Error: Cannot create Edge between Hubs ${pointA.name} and ${pointB.name}!`;

    // parentWorld : input validation
    switch(true) {
      case(pointA.parentWorld !== pointB.parentWorld):
        errCause = `The two Hubs in different Worlds`;
        throw Error(errBase + ' ' + errCause);
        break;
      
      default:
        this.parentWorld = pointA.parentWorld;
    }
    
    // distance : input validation
    switch(true) {
      case (distance <= 0):
        errCause = `Distance must be greater than zero. Given value ${distance}`;
        throw Error(errBase + ' ' + errCause);
        break;
      
      default:
        this.distance = distance;
    }
    
    // cost : input validation
    switch(true) {
      case (cost <= 0):
        errCause = `Cost must be greater than zero. Given value ${cost}`;
        throw Error(errBase + ' ' + errCause);
        break;
      
      default:
        this.cost = cost;
    }

    // shipSize : input validation
    switch(true) {
      case (shipSize <= 0):
        errCause = `The shipSize must be greater than zero. Given value ${shipSize}`;
        throw Error(errBase + ' ' + errCause);
        break;
      
      default:
        this.shipSize = shipSize;
    }
  }

  tick(): void {
    /**
     * Shipments can only be made where the same socket exists on both ends of the Edge
     * So here we start with pointA to iterate through sockets and confirm they exist on B
     * this get the intersection A ∩ B
     */ 
    for(let key in this.pointA.sockets) {
      // if socket of given item exists on both Hubs
      if(this.pointB.sockets[key] !== undefined) {
      
        // declare some stuff to make reading easier later
        let item = this.pointA.sockets[key].item;
        let aSocket = this.pointA.sockets[key];
        let bSocket = this.pointB.sockets[key];
        let doShip: boolean = false;
        let beg: ItemSocket;
        let end: ItemSocket;

        // if price delta > cost & reseve is met
        if (bSocket.LIP() - aSocket.LIP() > this.cost) {
          // ship from from A --> B
          doShip = true;
          beg = aSocket;
          end = bSocket;
        } 
        else if (aSocket.LIP() - bSocket.LIP() > this.cost) {
          // ship from from B --> A
          doShip = true;
          beg = bSocket;
          end = aSocket;
        }
        // else to both = no shipment called for. doShip remains false.

        // if a shipment is doable based on price
        if(doShip) {
          // set size of shipment based on beginning inventory and minReserve
          let q: number = beg.inventory - (beg.baseQty * item.minReserve);
              q = Math.min(q, this.shipSize);
              q = Math.max(q, 0);
          
          // if there is shippable inventory, do the shipment
          if (q > 0) {
            beg.inventory -= q;
            this.parentWorld.addShipment(beg.parentHub, end.parentHub, item, this.distance, q)
          }
        }
      }
    }
  }
}

/**
 * a Shipment is a collection of Items moving along Edges between two Hubs
 */
export class Shipment {
  /**
   * the world assigned identifier
   */
  id:           number;
  /**
   * The number of ticks that have been traveled so far.
   * current always starts at zero.
   */
  current:      number = 0;
  /**
   * The total number of ticks required to reach the destination
   */
  distance:     number;
  /**
   * The Hub from which this Shipment originated
   */
  origin :      Hub;
  /**
   * The Hub at which this Shipment will end it's journey
   */
  ending :      Hub;
  /**
   * The Item carried in this Shipment
   */
  item:         Item;
  /**
   * The amount of Item carried in this Shipment
   */
  quantity:     number;
  /**
   * a boolean indicator of if this shipment has been delivered
   */
  isDelivered:  boolean = false;

  constructor(id: number, origin: Hub, ending: Hub, item: Item, distance: number, quantity: number) {
    this.origin = origin;
    this.ending = ending;
    this.item = item;
    this.id = id;

    let errBase: string = `Error: Cannot create shipment from ${origin.name}!`;
    let errCause: string = ``;

    // distance : input validation
    switch(true) {
      case (distance <= 0):
        errCause = `Shipment.distance must be greater than zero. Given value = ${distance}`;
        throw Error(errBase + '' + errCause);
        break;
      
      default:
        this.distance = distance;
    }

    // quantity : input validation
    switch(true) {
      case (quantity <= 0):
        errCause = `Shipment.quantity must be greater than zero. Given value = ${quantity}`;
        throw Error(errBase + '' + errCause);
        break;
      
      default:
        this.quantity = quantity;
    }
  }

  tick(): void {
    // advance one tick
    this.current += 1;

    // if at destination, offload goods
    if( this.current == this.distance) {
      this.ending.sockets[this.item.name].inventory += this.quantity
      this.quantity = 0;

      this.isDelivered = true;
    }

  }
}
