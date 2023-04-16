/**
 * This file is to build the NWO simulation and return a NWO.World object
 * 
 * This is based on Skyrim major cities
 */
// import * as nwo from './scripts/nwo_v0.0.02';
import * as nwo from './scripts/nwo_v0.0.03';

export const world = new nwo.World;
  let i1: nwo.Item = world.addItem("Mead", 0.2, 30, 0.5, 0.33);
  let i2: nwo.Item = world.addItem("Food", 0.2, 20, 0.5, 1.00);

  let h1: nwo.Hub = world.addHub("Solitude")
  let h2: nwo.Hub = world.addHub("Morthal")
  let h3: nwo.Hub = world.addHub("Dawnstar")
  let h4: nwo.Hub = world.addHub("Winterhold")
  let h5: nwo.Hub = world.addHub("Windhelm")
  let h6: nwo.Hub = world.addHub("Riften")
  let h7: nwo.Hub = world.addHub("Whiterun")
  let h8: nwo.Hub = world.addHub("Falkreath")
  let h9: nwo.Hub = world.addHub("Markarth")

      h1.addSocket(i1, 0, 100);
      h2.addSocket(i1, 0, 30);
      h3.addSocket(i1, 0, 30);
      h4.addSocket(i1, 0, 20);
      h5.addSocket(i1, 0, 60);
      h6.addSocket(i1, 300, 60);
      h7.addSocket(i1, 150, 70);
      h8.addSocket(i1, 0, 30);
      h9.addSocket(i1, 0, 50);

      h1.addSocket(i2, 250, 310);
      h2.addSocket(i2, 100, 115);
      h3.addSocket(i2, 125, 165);
      h4.addSocket(i2, 100, 145);
      h5.addSocket(i2, 200, 280);
      h6.addSocket(i2, 400, 290);
      h7.addSocket(i2, 450, 370);
      h8.addSocket(i2, 200, 100);
      h9.addSocket(i2, 275, 325);
  
  
  
  
  
  
  
  

  let edges = [
  //      addEdge(pointA,   pointB, distance,   cost,   shipSize)
    world.addEdge(h1,       h9,     10,          5,      50), // 01 : Solitude    <--> Markarth
    world.addEdge(h1,       h2,      4,          2,      50), // 02 : Solitude    <--> Morthal
    world.addEdge(h2,       h9,     10,          5,      50), // 03 : Morthal     <--> Markarth
    world.addEdge(h9,       h7,     13,        6.5,      80), // 04 : Markarth    <--> Whiterun
    world.addEdge(h9,       h8,     12,          5,      50), // 05 : Markarth    <--> Falkreath
    world.addEdge(h2,       h3,      5,        2.5,      50), // 06 : Morthal     <--> Dawnstar
    world.addEdge(h2,       h7,      6,          3,      80), // 07 : Morthal     <--> Whiterun
    world.addEdge(h7,       h8,      7,        3.5,      80), // 08 : Whiterun    <--> Falreath
    world.addEdge(h8,       h6,      7,        3.5,     110), // 09 : Falreath    <--> Riften
    world.addEdge(h3,       h4,      6,          3,      50), // 10 : Dawnstar    <--> Winterhold
    world.addEdge(h3,       h5,      9,        4.5,      50), // 11 : Dawnstar    <--> Windhelm
    world.addEdge(h3,       h7,      8,          4,      80), // 12 : Dawnstar    <--> Whiterun
    world.addEdge(h7,       h4,     10,          5,      80), // 13 : Whiterun    <--> Winterhold
    world.addEdge(h7,       h5,      9,        4.5,      80), // 14 : Whiterun    <--> Windhelm
    world.addEdge(h7,       h6,     12,          6,     110), // 15 : Whiterun    <--> Riften
    world.addEdge(h4,       h5,      6,          3,      50), // 16 : Winterhold  <--> Windhelm
    world.addEdge(h5,       h6,      9,        4.5,     110), // 17 : Windhelm    <--> Riften

  ]


  /** ---------------------------------------------
   * 
   *  TO DO ITEMS
   * 
   *  a. don't build until called for
   *  b. make ability to release world and rebuild it
   *  c. eventually be able to read in a world from a file definition
   * 
   --------------------------------------------- */