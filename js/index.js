var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('div')[0],
    x0 = w.innerWidth || e.clientWidth || g.clientWidth,
    y0 = w.innerHeight|| e.clientHeight|| g.clientHeight;

   //(fairly messy, but preserves 6:5 aspect ratio)
	var verticalSpace = y0/8;
   var presHorAspect = (x0 - (y0 - 2*verticalSpace) * (5/6))/2;

var margin = {top: verticalSpace, right: presHorAspect, bottom: verticalSpace, left: presHorAspect},
    width = x0 - margin.left - margin.right,
    height = y0 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([0, 1])
    .range([0, width]);
 
var y = d3.scale.linear()
    .domain([0, 1])
    .range([height, 0]);
 
var area = d3.svg.area()
    .x(function(d) { return x(d.x); })
    .y0(height)
    .y1(function(d) { return y(d.y); })
    .interpolate('basis');
 
var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); })
    .interpolate('basis');
 
var svg = d3.select("div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.select("div").on("ontouchstart" in document ? "touchmove" : "mousemove", move);

d3.select(window).on('resize', resize); 

// TODO: init() method somewhere?
function resize() {
  
  d3.select('svg').remove();
  
  x0 = w.innerWidth || e.clientWidth || g.clientWidth,
  y0 = w.innerHeight|| e.clientHeight|| g.clientHeight;

   //(fairly messy, but preserves 6:5 aspect ratio)
  var verticalSpace = y0/8;
  var presHorAspect = (x0 - (y0 - 2*verticalSpace) * (5/6))/2;

	margin = {top: verticalSpace, right: presHorAspect, bottom: verticalSpace, left: presHorAspect},
    width = x0 - margin.left - margin.right,
    height = y0 - margin.top - margin.bottom;
 
   x = d3.time.scale()
    .domain([0, 1])
    .range([0, width]);
 
	y = d3.scale.linear()
    .domain([0, 1])
    .range([height, 0]);
  
	svg = d3.select("div").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
  draw(tmpData);

}

// Here is how we emulate PSR b1919+21:
var origData = d3.range(0, 60).map(function(y) {
    return d3.range(0, 40).map(function(x) {
        return {
            x: x / 40,
            y0: y / 60,
          y: (x < (Math.random()*4-2+13) || x > (Math.random()*4-2+27)) ? (y / 60) + (Math.random() / 7) / Math.abs(20-x) : (y / 60) + Math.sin(x / (Math.PI * 4)) * (Math.random() / 10)
        };
    });
}).reverse();

// There must be an easier way of deep-copying
var tmpData = d3.range(0, 60).map(function(y) {
    return d3.range(0, 40).map(function(x) {
        return {
            x: x / 40,
            y0: y / 60,
          y: y / 60
        };
    });
}).reverse();

function draw(data) {
 
    var wave = svg.selectAll('g.wave')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'wave');
 
    wave.append('path')
        .attr("class", "area")
        .attr("d", area);
    svg.selectAll('path.area').attr("d", area);
 
    wave.append('path')
        .attr("class", "line");
  	svg.selectAll('path.line').attr("d", line);
 
}

draw(tmpData);


function move() {
  var mouse = d3.mouse(this);
  x1 = mouse[0];
  y1 = mouse[1];
  d3.event.preventDefault(
  
  );
   for (var y = 0; y < tmpData.length; y++) {
        for (var x = 0; x < tmpData[y].length; x++) {
  			tmpData[y][x].y = origData[y][x].y0 +(origData[y][x].y - origData[y][x].y0)*y1/height;
        }
    }
  draw(tmpData);
}
