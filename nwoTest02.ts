/**
 * This file is to build the NWO simulation and return a NWO.World object
 */
import * as nwo from './scripts/nwo_v001';

export const world = new nwo.World;
  let i: nwo.Item = world.addItem("Food", 0.2, 20, 0.5, 1.0);

  let h1: nwo.Hub = world.addHub("Barcelona")
      h1.addSocket(i, 130, 100);

  let h2: nwo.Hub = world.addHub("Valencia")
      h2.addSocket(i, 100, 105)
  
  let h3: nwo.Hub = world.addHub("Malaga")
      h3.addSocket(i, 100, 105)
  
  // addEdge(pointA, pointB, distance, cost, shipSize)
  let e1: nwo.Edge = world.addEdge(h1, h2, 3, 7,  9);
  let e2: nwo.Edge = world.addEdge(h2, h3, 5, 5, 11);
  let e3: nwo.Edge = world.addEdge(h1, h3, 7, 3, 13);


  /** ---------------------------------------------
   * 
   *  TO DO ITEMS
   * 
   *  a. don't build until called for
   *  b. make ability to release world and rebuild it
   *  c. eventually be able to read in a world from a file definition
   * 
   --------------------------------------------- */