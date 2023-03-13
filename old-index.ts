/**
 * document document document!
 */

// Import stylesheets
import './style.css';
import * as nwo from './scripts/defs.ts'; // ignore this squigly red line
import * as g from './scripts/graph.ts'; // ignore this squigly red line
import * as d3 from 'd3';


do_listener()

// -----------------------------
// 
// BUILD THE WORLD
// 
// -----------------------------
  const world = new nwo.World;
  let i: nwo.Item = world.addItem("Food", 0.2, 20, 0.5, 1.0);

  let h1: nwo.Hub = world.addHub("Barcelona")
      h1.addSocket(i, 110, 100);

  let h2: nwo.Hub = world.addHub("Valencia")
      h2.addSocket(i, 100, 105)
  
  let h3: nwo.Hub = world.addHub("Malaga")
      h3.addSocket(i, 100, 105)
  
  // addEdge(pointA, pointB, distance, cost, shipSize)
  let e1: nwo.Edge = world.addEdge(h1, h2, 3, 7,  9);
  let e2: nwo.Edge = world.addEdge(h2, h3, 5, 5, 11);
  let e3: nwo.Edge = world.addEdge(h1, h3, 7, 3, 13);

// -----------------------------
// 
// HANDLE SOME PRELIMINARIES
// 
// -----------------------------

let btn = document.getElementById("tick");
    btn.addEventListener("click", (e:Event) => tick_and_show());

//showStats();  // just here to display the starting point
console.log(world)

// -----------------------------
// 
// DISPLAYING RESULTS
// 
// -----------------------------

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});


function tick_and_show() {
  let i:      number = 1;
  let i_max:  number = 30;

  let t_beg: number = Date.now();
  //console.log(`Simulation begins @ ${t_beg}`);
  while (i <= i_max) {
    world.tick();
    i++;
  }
  let t_end: number = Date.now();
  //console.log(`Simulation finishes @ ${t_end}`);
  console.log(`Simulation runtime in milliseconds = ${t_end - t_beg}`);
  //showStats();

  let cfg = { height : 200, width: 400, margin: { top: 20, right: 30, bottom: 30, left: 40 } }
  g.make_chart("#chart-price", world, cfg, "price");
  g.make_chart("#chart-inventory", world, cfg, "inventory");
  //make_chart("#d3box");
}


function do_listener(): void {
  document.querySelector("input[name=checkbox01]").addEventListener("change", click_malaga)
}

function click_malaga(event): void {
  console.log(`Malaga toggled! Value = ${this.checked}`)
}


/*** bleeeehhh. ignore these old things
 
function make_chart(where: string): void {
  let height: number = 400;
  let width: number = 800;
  let margin = { top: 20, right: 30, bottom: 30, left: 40 };
  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  // prepare data
  let data = []
  for(i in world.hubs) {
    data.push(
      world.log.ticks.filter( ({ hub_name }) => hub_name === world.hubs[i].name)
    )
  }
  //console.log(":: data ------------------");
  //console.log(data);
  //console.log("--------------------------");

  // determine the scales
  let prices = world.log.ticks.map(d => d.price)
  let yExtra: number = .15

  const xScale = d3
      .scaleLinear(
        // domain
        [ data[0][0].time, data[0][data[0].length - 1].time ],
        // range
        [margin.left, width - margin.right] )
  
  const yScale = d3
      .scaleLinear(
        // domain
        [ d3.min(prices) * (1 - yExtra), d3.max(prices) * (1 + yExtra) ],
        // range
        [height - margin.bottom, margin.top] )

  // make the axes
  const xAxis = d3.axisBottom(xScale)
                  .ticks(width / 40)
  const yAxis = d3.axisLeft(yScale)
                  .ticks(height / 30)
  
  // add a chart title
  // add a legend

  // line generator
  let line = d3
      .line()
      .x(d => xScale(+d.time))
      .y(d => yScale(+d.price))
      .curve(d3.curveLinear);
  
  // -----------------------
  // MAKE THE CHARTING YAH
  // -----------------------

  
  
  const div = d3.create("div")
  const svg = div
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", "100%")
    .attr("height", "100%")
    .on("pointerenter", pointerentered)
    .on("pointermove", pointermoved)
    .on("pointerleave", pointerleft)
    .on("touchstart", event => event.preventDefault())
    ;
  
  // do the lines
  const lines = svg
    .selectAll('path')
    .data(data)
    .join('path')
    .attr('class', 'price-lines')
    .attr('d', line)
    .style('stroke', (d, i) => colors(d[i]))
    .style('stroke-width', 2)
    .style('fill', 'transparent')
  
  // add the x axis display
  svg
    .append("g")
    .attr('class','x-axis')
    .attr("transform", `translate(0, ${height - margin.bottom})`)

    .call(xAxis);
  
  // add the y axis display
  svg
    .append("g")
    .attr('class', 'y-axis')
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis)

  // make a dot that indicates selected line
  const dot = svg.append("g").attr("display","none");
  dot.append("circle")
     .attr("class","dot-circle")
     .attr("r", 2.5)
  dot.append("text")
     .attr("class","dot-text")
     .attr("text-anchor", "middle")
     .attr("y", -8);

  // update the DOM element and actually add it to the page
  d3.select(where).html("")
  d3.select(where).html(div.html())


  // event handlers for the charts
  function pointermoved(event): void {
    const [xm, ym] = d3.pointer(event);
    console.log(`pointerMoved. xm = ${xm} and ym = ${ym}`)
    //const i = d3.least(I, i => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point
    //lines.raise();
    //dot.attr("transform", `translate(${xScale(X[i])},${yScale(Y[i])})`);
    //svg.property("value", O[i]).dispatch("input", {bubbles: true});
  }

  function pointerentered() {
    console.log("pointer entered");
    //lines.style("mix-blend-mode", null).style("stroke", "#ddd");
    dot.attr("display", null);
  }

  function pointerleft() {
    console.log("pointer left");
    //path.style("mix-blend-mode", mixBlendMode).style("stroke", null);
    dot.attr("display", "none");
    svg.node().value = null;
    svg.dispatch("input", {bubbles: true});
  }
}
  function showStats() {
    // get info to populate the Hub Table
    let b: nwo.ItemSocket = world.hubs.find(element => element.name == "Barcelona").sockets['Food'];
    let v: nwo.ItemSocket = world.hubs.find(element => element.name == "Valencia").sockets['Food'];
    let m: nwo.ItemSocket = world.hubs.find(element => element.name == "Valencia").sockets['Food'];
    let hrow = document.getElementById("stats_hub")
    let srow = document.getElementById("ships_hub")

    let q = {
      time: world.time,
      bInv: b.inventory,
      bPrice: formatter.format(b.LIP()),
      vInv: v.inventory,
      vPrice: formatter.format(v.LIP()),
      mInv: m.inventory,
      mPrice: formatter.format(m.LIP()),
    }

    // generate row element
    let r = document.createElement("tr")
        r.innerHTML = `<td>${q.time}</td><td>${q.bInv}</td><td>${q.bPrice}</td><td>${q.vInv}</td><td>${q.vPrice}</td><td>${q.mInv}</td><td>${q.mPrice}</td>`;
    // append to stats_hub
    hrow.append(r)

    // get list of shipments
    for(let i of world.hubs) {
      for(let j of i.shipments) {
        // populate a row in ships_hub for each
        r = document.createElement("tr")
        r.innerHTML = `<td>${world.time}</td><td>${j.ending.name}</td><td>${j.current}</td><td>${j.distance}</td><td>${j.item.name}</td><td>${j.quantity}</td>`

        srow.append(r)
      }
    }
    // add spacer
  }
  function showStats_old() {
    let out = document.createElement("div") 
        out.setAttribute("style", "position: static; border-bottom: 3px solid #73AD21; clear: both")

    let t = document.createElement("p")
        t.setAttribute("style", "font-weight: bold;")
        t.innerHTML = `Current tick: ${tick_count}`;
    out.append(t)

    // list prices at nodes
    let p = document.createElement("p")
        p.setAttribute("style", "float: left");
    for(let i of nodes) {
      let price: number = getLIP(i, item1);
      let x: string = `${i.name}: ${i.inventory} at $${price}`
      p.innerHTML += x + `</br>`
    }
    out.append(p)

    // list current shipments
    if (shipments.length == 0) {
      let s = document.createElement("p");
          s.innerHTML = "No shipments currently in progress";
          s.setAttribute("style", "float: right");
      out.append(s);
    } else {
      let t = document.createElement("table");
          t.setAttribute("cellpadding", "0");
          t.setAttribute("cellspacing", "5");
          t.setAttribute("style", "float: right")
      out.append(t);
      
      let h = document.createElement("thead");
          h.innerHTML = `<tr><th>Destination</th><th>Current</th><th>Distance</th><th>Item</th><th>Quantity</th></tr>`
      t.append(h)

      let b = document.createElement("tbody")
      for (let i of shipments) {
        // add row for each shipment
        let r = document.createElement("tr")
            r.innerHTML += `<td>${i.ending.name}</td><td>${i.current}</td><td>${i.distance}</td><td>${i.item.name}</td><td>${i.quantity}</td>`
        b.append(r)
      }
      t.append(b)
    }


    // add a clearing DIV so that the floats don't get messed up
    let h = document.createElement("div")
        h.setAttribute("style", "clear: both")
    out.append(h)

    //appDiv.append(out)
    appDiv.prepend(out)

  }

***/