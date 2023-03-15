import './style.css';
import * as graph from './grapher';
import { world as nwo } from './nwoTest02';
import * as d3 from 'd3';


/**
 * NOTES
 *  - is the d3 library really needed on THIS file?
 *  
 */

console.log(nwo);

/**
 * goState: true = play and false = pause
 */
let goState: boolean = false;

/**
 * tick_interval = seconds between each tick
 */
let tick_interval: number = 1.0;

/**
 * interval_ptr is the pointer to our setInverval that does the ticking
 */
let interval_ptr: ReturnType<typeof setInterval>


// Initialize buttons and start with goState = false. Then add event handlers so buttons will, you know, work.
toggle_goState(goState)
document.getElementById('btn-play').addEventListener('click', (e:Event) => { toggle_goState(true) })
document.getElementById('btn-pause').addEventListener('click', (e:Event) => { toggle_goState(false) })

// Initialize charts to show empty data
let cfg = { height : 200, width: 200, margin: { top: 20, right: 30, bottom: 30, left: 40 } }
graph.forceMapInitialize('graph-map', nwo, cfg);
graph.lineChartInitialize('grpah-inv', nwo, cfg, 'inventory');
graph.lineChartInitialize('grpah-price', nwo, cfg, 'price');












/* ----------------------------------------
 * 
 * FUNCTION DEFS
 * 
 * -------------------------------------- */ 


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
    nwo.tick();

    //  * 3. Update presentation
    //  *    - add/move shipments on graph
    //  *    - refresh stats table
    //  *    - update line charts
    //  *    - update tick count in navbar
    document.getElementById('tick-count').innerText = nwo.time.toString()
  }
}

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