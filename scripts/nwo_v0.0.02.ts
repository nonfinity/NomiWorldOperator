/**
 * Nomi World Operator
 * version: 0.0.02
 * 
 * Version notes:
 *  - This switches types over to the TypeScript Map construct
 *  - Promotes logging to a class rather than a growing / sprawling dict
 *  - World now has a list of all ItemSockets (no longer need to iterate by hub) 
 *  
 *  
 * NOTE! Version is under current work and not finished
 * 
 */
// -------------------------------------------------------------------------------------------------------------------------------


/**
 * Interface types used in the Log object
 */
  interface hubRecord {
    id:     number,
    name:   string,
  };
  interface edgeRecord {
    id:         number,
    pointA_id:  number,
    pointB_id:  number,
    distance:   number,
    cost:       number,
    shipSize:   number,
  };
  interface itemRecord {
    id:           number,
    name:         string,
    minReserve:   number,
    basePrice:    number,
    swing:        number,
    k_exp:        number,
  };
  interface socketRecord {
    id:           number,
    hub_id:       number,
    item_id:      number,
    inventory:    number,
    production:   number,
    consumption:  number,
    baseQty:      number,
  };
  interface shipmentRecord {
    id:           number,
    depart_time:  number,
    distance:     number,
    origin_id:    number,
    target_id:    number,
    item_id:      number,
    quantity:     number,
  };
  export interface socketTickRecord {
    time:         number,
    id:           number,
    hub_id:       number,
    hub_name:     string,
    item_id:      number,
    item_name:    string,
    inventory:    number,
    invRatio:     number,
    LIP:          number,

  };
  interface shipmentTickRecord {
    id:           number,
    current:      number,
    distance:     number,
    origin_id:    number,
    origin_name:  string,
    target_id:    number,
    target_name:  string,
    item_id:      number,
    item_name:    string,
    quantity:     number,
  };


/**
 * the World is the whole simulation model
 */
export class World {
  time:         number                        = 0;
  
  hubs:         Map<number, Hub>        = new Map<number, Hub>();
  edges:        Map<number, Edge>       = new Map<number, Edge>();
  items:        Map<number, Item>       = new Map<number, Item>();
  shipments:    Map<number, Shipment>   = new Map<number, Shipment>();
  sockets:      Map<number, ItemSocket> = new Map<number, ItemSocket>();

  keys = {
    hubs: 0,
    edges: 0,
    items: 0,
    shipments: 0,
    sockets: 0,
  };

  // logging setup
  log = new Log(this);

  /**
   * adds a new Hub to the World
   */
  addHub(name: string): Hub {
    let id: number = this.keyClaim('hubs');
    let x = new Hub(this, id, name);

    this.hubs.set(id, x);
    
    // log the hub
    this.log.logHub(x);
    return x;
  }
  
  /**
   * adds a new Edge between two Hubs
   */
  addEdge(pointA: Hub, pointB: Hub, distance: number, cost: number, shipSize: number): Edge {
    let id: number = this.keyClaim('edges');
    let x = new Edge(id, pointA, pointB, distance, cost, shipSize);
    
    this.edges.set(id, x);
    
    // register with Hubs also
    x.pointA.edges.set(id, x);
    x.pointB.edges.set(id, x);

    // log this edge
    this.log.logEdge(x);
    return x;
  }

  addItem(name: string, minReserve: number, basePrice: number, swing: number, k_exp: number = 1): Item {
    let id: number = this.keyClaim('items');
    let x: Item = new Item(this, id, name, minReserve, basePrice, swing, k_exp);
    
    this.items.set(id, x);

    // log this item
    this.log.logItem(x)
    return x;
  }

  addShipment(origin: Hub, target: Hub, item: Item, distance: number, quantity: number): Shipment {
    let id: number = this.keyClaim('shipments');
    let x: Shipment = new Shipment(id, origin, target, item, distance, quantity);

    this.shipments.set(id, x);

    // log this Shipment
    this.log.logShipment(x);
    return x;
  }

  getHubByID(which: number): Hub {
    return this.hubs.get(which);
  }

  getHubByName(which: string): Hub {
    let out: Hub

    for(let [key, value] of this.hubs) {
      if(value.name == which) {
        out = value
      }
    }

    return out;
  }

  getItemByID(which: number): Item {
    return this.items.get(which);
  }

  getItemByName(which: string): Item {
    let out: Item

    for(let [key, value] of this.items) {
      if(value.name == which) {
        out = value
      }
    }

    return out;
  }

  getSocketsFromHub(which: Hub): Map<number, ItemSocket> {
    let out: Map<number, ItemSocket>
    out = this.hubs.get(which.id).sockets

    return out;
  }

  getSocketsFromItem(which: Item): Map<number, ItemSocket> {
    let out: Map<number, ItemSocket>
    out = this.items.get(which.id).sockets

    return out;
  }

  getSocketByHubItem(hub: Hub, item: Item): ItemSocket {
    let out: ItemSocket

    // check which is larger so we can iterate throug the smaller list
    if(hub.sockets.size > item.sockets.size) {
      // fewer sockets on the item than the hub
      for(let [key, value] of item.sockets) {
        if(value.parentHub.id === hub.id) {
          out = value;
        }
      }
    } else {
      // same or fewer sockets on the hub than the item
      for(let [key, value] of hub.sockets) {
        if(value.item.id === item.id) {
          out = value;
        }
      }
    }

    return out;
  }

  keyClaim(which: string): number {
    let out: number

    if(this.keys[which] !== undefined) {
      out = this.keys[which];
      this.keys[which] += 1;
    }
    return out;
  }

  keyPeek(which: string): number {
     let out: number

    if(this.keys[which] !== undefined) {
      out = this.keys[which];
      // this.keys[which] += 1;
    }
    return out;
  }


  /**
   * a tick is a single unit of time in the primary simulation loop
   */
  tick(): void {
    this.time += 1;

    // perform production and consumption
    for(let [key, value] of this.hubs) {
      value.tick();
    }

    // process shipments in transit
    for(let [key, value] of this.shipments) {
      value.tick();
      
      // filter out delivered shipments
      if (value.isDelivered) {
        this.shipments.delete(key);
      }
    }

    // launch shipments if needed
    for(let [key, value] of this.edges) {
      value.tick();
    }

    this.log.logTick();
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
  // sockets:       { [key: string]: ItemSocket; } = {};
  sockets:      Map<number, ItemSocket> = new Map<number, ItemSocket>();
  /**
   * the array of Edges connected to this Hub
   */
  // edges:        Edge[] = [];
  edges:        Map<number, Edge> = new Map<number, Edge>();

  constructor(world:World, id: number, name: string) {
    this.parentWorld = world;
    this.name = name;
    this.id = id;
  }

  /**
   * The main doer fuction
   */
  tick(): void {
    // no work currently done on the hub itself


    // tick the sockets to update inventories
    for(let [key, value] of this.sockets) {
      value.tick()
    }
  }

  /**
   * return a log of this object
   */
  getRecord(): hubRecord {
    let out: hubRecord = {
      id: this.id,
      name: this.name,
    };

    return out;
  }
  
  /**
   * add a new ItemSocket to this Hub
   */
  addSocket(item:Item, production: number, consumption: number, inventory?: number, baseQty?: number): void {
    let id: number = this.parentWorld.keyClaim('sockets');
    let x = new ItemSocket(this, id, item, production, consumption, inventory, baseQty);
  
    this.sockets.set(id, x);
    this.parentWorld.sockets.set(id ,x);

    // log this socket
    this.parentWorld.log.logItemSocket(x);
  }

  getSocketbyItemName(which: string): ItemSocket {
    let out: ItemSocket;

    for(let [key, value] of this.sockets) {
      if(value.item.name === which) {
        out = value;
      }
    }

    return out;
  }

  getSocketbyItemID(which: number): ItemSocket {
    let out: ItemSocket;

    for(let [key, value] of this.sockets) {
      if(value.item.id === which) {
        out = value;
      }
    }

    return out;
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
  /**
   * a Map of sockets for this item
   */
  sockets:        Map<number, ItemSocket> = new Map<number, ItemSocket>(); 

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

  /**
   * return a log of this object
   */
  getRecord(): itemRecord {
    let out: itemRecord = {
      id:           this.id,
      name:         this.name,
      minReserve:   this.minReserve,
      basePrice:    this.basePrice,
      swing:        this.swing,
      k_exp:        this.k_exp,
    };

    return out;
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
   * World determined identifier
   */
  id:           number;
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

  // plug values: come back and clean them up:
  maxInvMult: number = 2.5;     // maximum inventory level as a multiple of baseQty
  canExport(): boolean { return this.invRatio() > 0.2 }
  canImport(): boolean { return this.invRatio() < 2.0 }

  constructor(parentHub: Hub, id: number, item: Item, production: number, consumption: number, 
              inventory: number = 2 * (production + consumption), baseQty: number = 2 * (production + consumption) ) {
    this.parentHub = parentHub;
    this.item = item;
    this.id = id;

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

    // on creation register yourself with your parent Hub and item
    parentHub.sockets.set(id, this);
    item.sockets.set(id, this);
  }

  /**
   * the main doer function
   */
  tick(): void {
    // clean this up so it's not a hard min/max on the inventory
    
    this.inventory += this.production - this.consumption;
    this.inventory = Math.min( this.maxInvMult * this.baseQty , Math.max(0, this.inventory) );
  }

  /**
   * return a log of this object
   */
  getRecord(): socketRecord {
    let out: socketRecord = {
      id:           this.id,
      hub_id:       this.parentHub.id,
      item_id:      this.item.id,
      inventory:    this.inventory,
      production:   this.production,
      consumption:  this.consumption,
      baseQty:      this.baseQty,
    };

    return out;
  }

  /**
   * return a log of this object for Tick records
   */
  getTickRecord(): socketTickRecord {
    let out: socketTickRecord = {
      time:         this.parentHub.parentWorld.time,
      id:           this.id,
      hub_id:       this.parentHub.id,
      hub_name:     this.parentHub.name,
      item_id:      this.item.id,
      item_name:    this.item.name,
      inventory:    this.inventory,
      invRatio:     this.invRatio(),
      LIP:          this.LIP(),
    };

    return out;
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
    let r: number = this.invRatio();
    if(r-1 >= 0) {
      out = -1 * this.item.swing * this.item.basePrice * Math.pow(r - 1, this.item.k_exp) + this.item.basePrice;
    } else {
      let tmp_r: number = 2 - r; // or (1-r) + r ... to mirror the value around 1
      let tmp_p: number = -1 * this.item.swing * this.item.basePrice * Math.pow(tmp_r - 1, this.item.k_exp) + this.item.basePrice;

      // don't let extreme inventory levels allow prices to go negative
      out = Math.max(0, 2 * this.item.basePrice - tmp_p); // or (base - tmp) + base ... to mirror the value around basePrice
    }

    

    return out;
  }
}

/**
 * an Edge is a bidirectional connection between two Hubs
 */
export class Edge {
  // Child properties
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
  //

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
    for(let [key, value] of this.pointA.sockets) {
      // declare some stuff to make reading easier later
      let aSocket = value;
      let bSocket = this.pointB.getSocketbyItemID(value.item.id);

      // if socket of given item exists on both Hubs
      if(bSocket !== undefined ) {
      
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
          let q: number = beg.inventory - (beg.baseQty * value.item.minReserve);
              q = Math.min(q, this.shipSize);
              q = Math.max(q, 0);
          
          // if there is shippable inventory, do the shipment
          if (q > 0) {
            beg.inventory -= q;
            let x = this.parentWorld.addShipment(beg.parentHub, end.parentHub, value.item, this.distance, q)
            // console.log(`Shipment ${x.id} departed @ ${x.origin.name} with ${x.quantity} units of ${x.item.name}`);
          }
        }
      }
    }
  }

  /**
   * return a log of this object
   */
  getRecord(): edgeRecord {
    let out: edgeRecord = {
      id:         this.id,
      pointA_id:  this.pointA.id,
      pointB_id:  this.pointB.id,
      distance:   this.distance,
      cost:       this.cost,
      shipSize:   this.shipSize,
    };

    return out;
  }
}

/**
 * a Shipment is a collection of Items moving along Edges between two Hubs
 */
export class Shipment {
  // Child properties
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
     * The remaining number of ticks required to reach the destination
     */
    distance:     number;
    /**
     * The Hub from which this Shipment originated
     */
    origin :      Hub;
    /**
     * The Hub at which this Shipment will end it's journey
     */
    target :      Hub;
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
  //

  constructor(id: number, origin: Hub, target: Hub, item: Item, distance: number, quantity: number) {
    this.origin = origin;
    this.target = target;
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
      // console.log(`Shipment ${this.id} arrived @ ${this.target.name} with ${this.quantity} units of ${this.item.name}`);
      this.target.getSocketbyItemID(this.item.id).inventory += this.quantity
      this.quantity = 0;

      this.isDelivered = true;
    }

  }

  getRecord(): shipmentRecord {
    let out: shipmentRecord = {
      id:           this.id,
      depart_time:  this.origin.parentWorld.time,
      distance:     this.distance,
      origin_id:    this.origin.id,
      target_id:    this.target.id,
      item_id:      this.item.id,
      quantity:     this.quantity,
    };

    return out;
  }
  /**
   * return a log of this object for Tick records
   */
  getTickRecord(): shipmentTickRecord {
    let out: shipmentTickRecord = {
      id:           this.id,
      current:      this.current,
      distance:     this.distance,
      origin_id:    this.origin.id,
      origin_name:  this.origin.name,
      target_id:    this.target.id,
      target_name:  this.target.name,
      item_id:      this.item.id,
      item_name:    this.item.name,
      quantity:     this.quantity,
    };

    return out;
  }
}

/**
 * Log class contains all the definitions for an rich logging object
 */
class Log {
  parentWorld: World;

  environment: {
    [`hubs`]:         Map<number, hubRecord>,
    [`edges`]:        Map<number, edgeRecord>,
    [`items`]:        Map<number, itemRecord>,
    [`itemSockets`]:  Map<number, socketRecord>,
    [`shipments`]:    Map<number, shipmentRecord>,
  } = {
    hubs         : new Map<number, hubRecord>(),
    edges        : new Map<number, edgeRecord>(),
    items        : new Map<number, itemRecord>(),
    itemSockets  : new Map<number, socketRecord>(),
    shipments    : new Map<number, shipmentRecord>(),
  }

  shipmentTicks:  Map<number, shipmentTickRecord[]> = new Map<number, shipmentTickRecord[]>();
  socketTicks:    Map<number, socketTickRecord[]>   = new Map<number, socketTickRecord[]>();

  constructor(parent: World) {
    this.parentWorld = parent;

    console.log(this);
  }

  logEnvironment(): void {
    // pull info from parentWorld to register everything
    let w: World = this.parentWorld
    let names: string[] = ['hubs', 'edges', 'items']

    for(let set in names) {
      for(let i in w[set]) {
        let id: number = w[set][i].id;
        if(!this.environment[set].has(id)) {
          this.environment[set].set(id, w[set][i].getRecord());
        }

        // if hubs, then do ItemSockets too
        if(set === 'hubs') {
          let sockets = w[set].sockets;
          for(let s in sockets) {
            this.environment.itemSockets.set(sockets[s].id, sockets[s].getRecord());
          }
        }
      }
    }
  }

  logHub(which: Hub) {                this.environment.hubs.set(which.id, which.getRecord());         }
  logItem(which: Item) {              this.environment.items.set(which.id, which.getRecord());        }
  logEdge(which: Edge) {              this.environment.edges.set(which.id, which.getRecord());        }
  logItemSocket(which: ItemSocket) {  this.environment.itemSockets.set(which.id, which.getRecord());  }
  logShipment(which: Shipment) {      this.environment.shipments.set(which.id, which.getRecord());    }

  logTick(): void {
    // pull info from parentWorld to register everything
    let shipments : shipmentTickRecord[]  = [];
    let sockets   : socketTickRecord[]    = [];
    let tick: number = this.parentWorld.time;

    // populate shipment record prep
    for(let [key, value] of this.parentWorld.shipments) {
      shipments.push(value.getTickRecord());
    }

    // populate socket record prep
    for(let [key, value] of this.parentWorld.sockets) {
      sockets.push(value.getTickRecord());
    }

    this.shipmentTicks.set(tick, shipments);
    this.socketTicks.set(tick, sockets);
  }

  getLastSocketTick(): socketTickRecord[] {
    return this.socketTicks.get(this.socketTicks.size);
  }

  getLastShipmentTick(): shipmentTickRecord[] {
    return this.shipmentTicks.get(this.shipmentTicks.size);
  }

}