import './style.css';
import { world } from './nwoTest03';
import { forceMap } from './forcemap';
import { lineChart } from './linechart';

/**
 * NOTES
 *  
 *  
 */

console.log(world);

/**
 * goState: true = play and false = pause
 */
let goState: boolean = false;

/**
 * tick_interval = seconds between each tick
 */
let tick_interval: number = 0.25;

/**
 * interval_ptr is the pointer to our setInverval that does the ticking
 */
let interval_ptr: ReturnType<typeof setInterval>

/**
 * the first Item in the simulation. All graphs will be defaulted to this.
 */
let firstItem: string = ""


// Initialize buttons and start with goState = false. Then add event handlers so buttons will, you know, work.
toggle_goState(goState)
document.getElementById('btn-play').addEventListener('click', (e:Event) => { toggle_goState(true) })
// document.getElementById('btn-play').addEventListener('click', (e:Event) => { local_tick(true) })
document.getElementById('btn-pause').addEventListener('click', (e:Event) => { toggle_goState(false) })

// Initialize charts to show empty data
let cfg = { height : 400, width: 400, margin: { top: 10, right: 10, bottom: 20, left: 20 } }

let graph_UL: forceMap  =  new forceMap('graph-map-parent', cfg, world, 'Food');
let graph_BL: lineChart = new lineChart('graph-price-parent', cfg, world, '', 'LIP');
let graph_BR: lineChart = new lineChart('graph-inv-parent', cfg, world, '', 'inventory');

populate_item_lists()

// set items on the charts
graph_UL.change_item(world, firstItem);
graph_BL.change_item(world, firstItem);
graph_BR.change_item(world, firstItem);










/* ----------------------------------------
 * 
 * FUNCTION DEFS
 * 
 * -------------------------------------- */ 

/**
 * format prices in currency
 */
const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

/**
 * beep produces a single toned beep sound
 */
function beep(freq = 475, duration = 50, vol = 50): void {
  let context = new AudioContext()
  let oscillator = context.createOscillator();
  let gain = context.createGain();
  oscillator.connect(gain);
  oscillator.frequency.value = freq;
  oscillator.type = "sine";
  gain.connect(context.destination);
  gain.gain.value = vol * 0.01;
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + duration * 0.001);
}

/**
 * Updates the status of whether the simulation is playing or paused
 */
function toggle_goState(setState: boolean = !goState): void {
  // if not provided, flip the state
  goState = setState;

  let b: HTMLButtonElement;
  b = <HTMLButtonElement> document.getElementById('btn-play');
  b.disabled = goState;

  b = <HTMLButtonElement> document.getElementById('btn-pause');
  b.disabled = !goState;

  if(goState) {
    interval_ptr = setInterval(local_tick, tick_interval * 1000)
  } else if(interval_ptr !== undefined) {
    clearInterval(interval_ptr)
  }
}

/**
 * this is the local wrapper for NWO.World.tick() and includes 
 * cosmetics associated with displaying the results.
 */
function local_tick(state: boolean = goState): void {
  if(state) {
    //  * 1. make a beep
    beep();

    //  * 2. NWO.World.tick()
    world.tick();

    //  * 3. Update presentation
    //  *    - add/move shipments on force graph
    graph_UL.update(world)

    //  *    - update line charts
    graph_BL.update(world)
    graph_BR.update(world)

    //  *    - refresh stats table
    //table_update();

    //  *    - update tick count in navbar
    document.getElementById('tick-count').innerText = world.time.toString()
  }
}

/**
 * updates the display on the top right table
 */
function table_update() {
  let displayRows: number = 10

  let home: HTMLDivElement = <HTMLDivElement> document.getElementById('grid-container');

  let d: HTMLDivElement = document.createElement('div');
    d.setAttribute('class', `grid-cell tick-${world.time}`);
    d.setAttribute('style', 'grid-column: 1');
    d.innerText = world.time.toString();
    home.appendChild(d);
    
  for(let i in world.hubs) {
    let h = world.hubs[i];

    d = document.createElement('div');
    d.setAttribute('class', `grid-cell tick-${world.time}`);
    d.setAttribute('style', `grid-column: ${i * 2 + 2}`);
    d.innerText = currency.format(h['sockets']['Food'].LIP());
    home.appendChild(d);

    d = document.createElement('div');
    d.setAttribute('class', `grid-cell tick-${world.time}`);
    d.setAttribute('style', `grid-column: ${2 * i + 3}`);
    d.setAttribute('tick', world.time.toString());
    d.innerText = h['sockets']['Food']['inventory'].toString()
    home.appendChild(d);
  }

  let cut = home.querySelectorAll(`.tick-${world.time - displayRows}`)
  //console.log(`seeking: tick-${world.time - displayRows}`)
  //console.log(cut);
  cut.forEach(d => d.parentNode.removeChild(d) );

  /*
  for(let i of home.children) {
    if(i.getAttribute('tick') !== null) {
      if(+i.getAttribute('tick') < (world.time - displayRows)) {
        i.remove()
      }
    }
  }
  */
}

/**
 * populates the drop down lists with the set of items in the World
 */
function populate_item_lists() {
  let places = document.getElementsByName('item-list');
  //console.log(places);

  // let items = Object.values(world.items).map(d => ({ name: d.name, id: d.id }) )
  for(let p of places) {
    p.addEventListener("change", item_changed);

    for (let [key, value] of world.items) {
      if(firstItem === "") { firstItem = value.name; }

      let tmp: HTMLOptionElement = document.createElement('option')
      tmp.setAttribute('value', value.name)
      tmp.innerText = value.name
      
      p.appendChild(tmp);
    }

    p.setAttribute('value', firstItem);
  }
}

/**
 * eventhandler for when an item dropdown is changed
 */
function item_changed(event) {
  // console.log(`selector ${this.getAttribute('id')} has value of "${this.value}"`)
  
  // let graph_map: { [key : string] : lineChart }= {
  //   'price-item' : graph_BL,
  //   'inventory-item' : graph_BR,
  // }

  let change_set = [
    graph_UL,
    graph_BL,
    graph_BR,
  ]

  for(let i of change_set) {
    i.change_item(world, this.value);
  }

  // graph_map[this.getAttribute('id')].itemName = this.value;
  // graph_map[this.getAttribute('id')].change_item(world, this.value);

}