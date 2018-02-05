
function row(d) {
  return {
    planet: d.planet,
    distance: +d.distance,
    radius: +d.radius,
    text: d.text
  };
} // row()


/* Data load and visual */
/* ==================== */

d3.csv('data/planets.csv', row).then(function(data) {

  console.log(data);

  /* Set up */
  /* ====== */

  var dur = 2000,
      format = d3.format(',');

  var margin = { top: 30, right: 50, bottom: 30, left: 0 },
      width = window.innerWidth - margin.left - margin.right,
      height = window.innerHeight * 0.66 - margin.top - margin.bottom;

  var svg = d3.select('#vis')
    .append('svg')
      .attr('width', width + margin.left + margin.top)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');


  /* Scales */
  /* ====== */

  var rExtent = d3.extent(data, function(d) { return d.radius; });
  
  var rScale = d3.scaleLinear().domain([0, rExtent[1]]).range([0, height * 0.75]);
  var xScale = d3.scalePoint().domain(data.map(function(el) { return el.planet; })).range([50, width * 0.975]);


  /* Build vis */
  /* ========= */

  /* Sun and planets */
  /* --------------- */


  svg.selectAll('.planet')
    .data(data).enter()
    .append('circle')
      .attr('class', 'planet')
      .attr('id', function(d) { return d.planet; })
      .attr('cx', function(d) { return xScale(d.planet); })
      .attr('cy', height / 2)
      .attr('r', 0)
    .transition().duration(dur).ease(d3.easeElastic.period(0.9))
      .attr('r', function(d) { return rScale(d.radius); });

  var rSun = rScale(data.filter(function(el) { return el.planet === 'Sun'; })[0].radius); // move Sun out of the way

  d3.select('#Sun').attr('transform', 'translate(' + (-rSun * 0.9) + ', ' + '0)');


  /* Saturn's arc */
  /* ------------ */

  // get the arc points required for drawing
  var saturnPoints = {

    center: {
      x: xScale('Saturn'),
      y: height / 2
    },
    radius: rScale(data.filter(function(el) { return el.planet === 'Saturn'; })[0].radius)

  };

  // Move to: x = Saturn center x minus radius; y = Saturn center y - half of the arc's y radius
  // Arc: x radius = a 1.5 times larger Saturn radius; y radius 1/3rd of Saturn radius 
  // Angle and flags: no arc rotation = 0; drawing the large arc = 1; drawing the lower (not the upper sweep) arc = 0
  // End at: x = Saturn center x plus radius; y = Saturn center y - half of the arc's y radius
  var saturnArc = 
    'M' + (saturnPoints.center.x - saturnPoints.radius) + ' ' + (saturnPoints.center.y - (saturnPoints.radius * 0.33 / 2)) + ' ' + 
    'A ' + (saturnPoints.radius * 1.5) + ' ' + (saturnPoints.radius * 0.33)  + ' 0 1 0 ' + 
    (saturnPoints.center.x + saturnPoints.radius) + ' ' + (saturnPoints.center.y - (saturnPoints.radius * 0.33 / 2));

  // append the arc
  d3.timeout(function() {  

    svg.append('path')
        .attr('d', saturnArc)
        .attr('stroke-width', 5)
        .attr('stroke', 'deeppink')
        .attr('fill', 'none');

  }, dur * 1.2);


  d3.timeout(function() {  

    /* Labels */
    /* ------ */

    svg.selectAll('.label')
      .data(data).enter()
      .append('text')
        .attr('class', 'label')
        .attr('id', function(d) { return 'label-' + d.planet; })
        .attr('x', function(d) { return xScale(d.planet); })
        .attr('y', height / 3)
        .attr('dx', -1)
        .attr('dy', -3)
        .text(function(d) { return d.planet; })
        .style('opacity', 0)
      .transition().delay(function(d, i) { return i * 30; })
        .style('opacity', 1);
    
    d3.select('#label-Sun').attr('transform', 'translate(0, ' + (-height * 0.25) + ')');


    /* Lines */
    /* ------ */

    svg.selectAll('.label-line')
      .data(data).enter()
      .append('line')
        .attr('class', 'label-line')
        .attr('id', function(d) { return 'line-' + d.planet; })
        .attr('x1', function(d) { return xScale(d.planet); })
        .attr('y1', height / 3)
        .attr('x2', function(d) { return xScale(d.planet); })
        .attr('y2', function(d) { return height / 2 - rScale(d.radius) - 4; })
        .style('opacity', 0)
      .transition().delay(function(d, i) { return i * 30; })
        .style('opacity', 1);
    
    d3.select('#line-Sun').remove();


    /* Note */
    /* ---- */

    svg.append('text')
        .attr('id', 'note')
        .attr('x', width + margin.right / 4)
        .attr('y', height + margin.bottom / 2)
        .attr('text-anchor', 'end')
        .text('sizes scaled - distances not');

  }, dur/2);

  /* Interactivity */
  /* ------------- */

  var offset = d3.select('h1').node().getBoundingClientRect().height;

  d3.selectAll('.planet').on('mouseover', mouseover);
  d3.selectAll('.planet').on('mousemove', mousemove);
  d3.selectAll('.planet').on('mouseout', mouseout);


  function mouseover(d) {

    d3.select('#tooltip')
      .style('opacity', 0.9)
      .style('top', (d3.mouse(this)[1] + offset) + 'px')
      .style('left', d.planet === 'Sun' 
        ? (d3.mouse(this)[0]-rSun * 0.9 + 20) + 'px' 
        : d.planet === 'Pluto'
          ? (d3.mouse(this)[0] - 250) + 'px'
          : (d3.mouse(this)[0] + 20) + 'px');

    var htmlHeader = 
      '' + d.planet + '<br>' +
      '<span id="small">Radius: ' + format(d.radius) + ' km <br>' +
      'Distance to sun: ' + format(d.distance) + ' km </span><br>';

    d3.select('#tip-header')
      .html(htmlHeader);

    d3.select('#tip-body')
      .html(d.text);

  } // mouseover()

  function mousemove(d) {

    d3.select('#tooltip')
      .style('top', (d3.mouse(this)[1] + offset) + 'px')
      .style('left', d.planet === 'Sun' 
        ? (d3.mouse(this)[0]-rSun * 0.9 + 20) + 'px' 
        : d.planet === 'Pluto'
          ? (d3.mouse(this)[0] - 250) + 'px'
          : (d3.mouse(this)[0] + 20) + 'px');

  } // mousemove()

  function mouseout() {

    d3.select('#tooltip')
      .transition().duration(50)
      .style('opacity', 0);

  } // mouseout()

}); // d3.csv()

