/**
 * This file is to build the NWO simulation and return a NWO.World object
 */
import * as nwo from './scripts/nwo_v0.0.02';

export const world = new nwo.World;

//name: string, minReserve: number, basePrice: number, swing: number, k_exp: number = 1
//                     .addItem(name,       minReserve, basePrice,  swing,  k_exp);
let i1: nwo.Item = world.addItem("Food",     0.2,        20,         0.5,    1.0);
let i2: nwo.Item = world.addItem("Ore",     0.05,       75,         0.8,    3.0);

let h1: nwo.Hub = world.addHub("Barcelona");
let h2: nwo.Hub = world.addHub("Valencia");
let h3: nwo.Hub = world.addHub("Malaga");

    // adding food sockets
    h1.addSocket(i1, 110, 100);
    h2.addSocket(i1, 100, 105);
    h3.addSocket(i1, 100, 105);

    // adding ore sockets
    h1.addSocket(i2,  50,  55);
    h2.addSocket(i2,  50,  60);
    h3.addSocket(i2,  65,  50);

//                       addEdge(pointA,  pointB, distance,   cost,   shipSize)
let e1: nwo.Edge = world.addEdge(h1,      h2,     3,          9,      20);
let e2: nwo.Edge = world.addEdge(h2,      h3,     5,          7,      20);
let e3: nwo.Edge = world.addEdge(h1,      h3,     7,          5,      20);


  /** ---------------------------------------------
   * 
   *  TO DO ITEMS
   * 
   *  a. don't build until called for ... what does "build" mean?
   *  b. make ability to release world and rebuild it
   *  c. eventually be able to read in a world from a file definition
   * 
   --------------------------------------------- */