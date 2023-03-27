/**
 * This file is to build the NWO simulation and return a NWO.World object
 * 
 * This is based on Skyrim major cities
 */
import * as nwo from './scripts/nwo_v0.0.02';

export const world = new nwo.World;
  let i: nwo.Item = world.addItem("Mead", 0.2, 20, 0.5, 0.33);

  let h1: nwo.Hub = world.addHub("Solitude")
      h1.addSocket(i, 0, 100);

  let h2: nwo.Hub = world.addHub("Morthal")
      h2.addSocket(i, 0, 30)
  
  let h3: nwo.Hub = world.addHub("Dawnstar")
      h3.addSocket(i, 0, 30)
  
  let h4: nwo.Hub = world.addHub("Winterhold")
      h4.addSocket(i, 0, 20)
  
  let h5: nwo.Hub = world.addHub("Windhelm")
      h5.addSocket(i, 0, 60)
  
  let h6: nwo.Hub = world.addHub("Riften")
      h6.addSocket(i, 300, 60)
  
  let h7: nwo.Hub = world.addHub("Whiterun")
      h7.addSocket(i, 150, 70)
  
  let h8: nwo.Hub = world.addHub("Falkreath")
      h8.addSocket(i, 0, 30)
  
  let h9: nwo.Hub = world.addHub("Markarth")
      h9.addSocket(i, 0, 50)
  

  let edges = [
  //      addEdge(pointA,   pointB, distance,   cost,   shipSize)
    world.addEdge(h1,       h9,     5,          5,      50), // 01 : Solitude    <--> Markarth
    world.addEdge(h1,       h2,     5,          5,      50), // 02 : Solitude    <--> Morthal
    world.addEdge(h2,       h9,     5,          5,      50), // 03 : Morthal     <--> Markarth
    world.addEdge(h9,       h7,     5,          5,      80), // 04 : Markarth    <--> Whiterun
    world.addEdge(h9,       h8,     5,          5,      50), // 05 : Markarth    <--> Falkreath
    world.addEdge(h2,       h3,     5,          5,      50), // 06 : Morthal     <--> Dawnstar
    world.addEdge(h2,       h7,     5,          5,      80), // 07 : Morthal     <--> Whiterun
    world.addEdge(h7,       h8,     5,          5,      80), // 08 : Whiterun    <--> Falreath
    world.addEdge(h8,       h6,     5,          5,     110), // 09 : Falreath    <--> Riften
    world.addEdge(h3,       h4,     5,          5,      50), // 10 : Dawnstar    <--> Winterhold
    world.addEdge(h3,       h5,     5,          5,      50), // 11 : Dawnstar    <--> Windhelm
    world.addEdge(h3,       h7,     5,          5,      80), // 12 : Dawnstar    <--> Whiterun
    world.addEdge(h7,       h4,     5,          5,      80), // 13 : Whiterun    <--> Winterhold
    world.addEdge(h7,       h5,     5,          5,      80), // 14 : Whiterun    <--> Windhelm
    world.addEdge(h7,       h6,     5,          5,     110), // 15 : Whiterun    <--> Riften
    world.addEdge(h4,       h5,     5,          5,      50), // 16 : Winterhold  <--> Windhelm
    world.addEdge(h5,       h6,     5,          5,     110), // 17 : Windhelm    <--> Riften

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