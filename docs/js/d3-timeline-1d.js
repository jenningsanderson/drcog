var startDate, endDate
var maxDate, minDate
var brushOn

const MILLISECONDS_IN_A_DAY = 1000*86400;

var D3Timeline1D = function(brushEventFunction){

  var x,y,data;

  var currentDate = undefined;

  //Main constructor
  this.createD3Timeline = function(params){
    params.docID = params.docID || "timeline-svg"

    var svg = d3.select("#"+params.docID),
        margin = {top: 10, right: 50, bottom: 25, left: 50},
        width  = + document.getElementById('timeline').clientWidth  - margin.left - margin.right,
        height = + svg.attr("height") - margin.top  - margin.bottom;

    //clear the existing canvas
    svg.selectAll("*").remove();

    x = d3.scaleTime().range([0, width]).clamp(true);

    y = d3.scaleLinear().range([height, 0]);

    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);
                  // .ticks(4);

    var area = d3.area()
      .curve(d3.curveMonotoneX)
      .x(function(d) { return x(d.date); })
      .y0(height)
      .y1(function(d) { return y(d.count); });

    svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    var focus = svg.append("g")
      .attr("class", "focus")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data = params.data //Or something else?

    maxDate = d3.max(data, function(d) { return d.date; })
    minDate = d3.min(data, function(d) { return d.date; })

    x.domain([minDate, maxDate]);

    //max within the dates
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    var daysShown = ( maxDate.getTime() - minDate.getTime() ) / MILLISECONDS_IN_A_DAY
    var bandWidth = (width / daysShown)

    focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

    focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var slider = svg.append("g")
      .attr("class", "slider")
      .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { dragged(x.invert(d3.event.x))}) );

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 15);

    function dragged(d){
      handle.attr("cx", x(d));
      currentDate = d;
      brushEventFunction(d);
    }

    document.onkeydown = checkKey;

    function checkKey(e) {

      const MULTIPLIER = 1

      e = e || window.event;

      if (e.keyCode == '188') {
          dragged(
            new Date(currentDate.getTime() + ((1000*3600*24) * -1 * MULTIPLIER) )
          )
      }
      else if (e.keyCode == '190') {
        dragged(
          new Date(currentDate.getTime() + ((1000*3600*24) * 1 * MULTIPLIER) )
        )
      }
    }

    //move to latest
    dragged(maxDate);
  }
}
