d3.json('https://d3fc.io/examples/bubble/data.json', function(_, data) {
  // convert string properties to numbers
  data.forEach(function(d) {
    d.income = Number(d.income);
    d.population = Number(d.population);
    d.lifeExpectancy = Number(d.lifeExpectancy);
  });

  var regions = d3.set(data.map(function(d) { return d.region; }));
  var color = d3.scaleOrdinal(d3.schemeCategory10).domain(regions.values());
  var legend = d3.legendColor().scale(color);

  var size = d3.scaleLinear().range([20, 800])
              .domain(fc.extentLinear()
                .accessors([d => d.population])(data));

  var radiusScale = d3.scaleSqrt().domain([0, 5e8]).range([0, 40]);
  function population(d) { return d.population; };
  function pointArea(d) { return Math.pow(radiusScale(population(d)), 2) * Math.PI; }

  var pointSeries = fc.seriesSvgPoint()
      .crossValue(function(d) { return d.income; })
      .mainValue(function(d) { return d.lifeExpectancy; })
      .size(pointArea)
      .decorate(function(sel) {
        sel.enter()
            .attr('fill', function(d) { return color(d.region); });
      });

  var chart = fc.chartSvgCartesian(
                d3.scaleLog(),
                d3.scaleLinear()
              )
      .xDomain(fc.extentLinear()
        .accessors([d => d.income])(data))
      .yDomain(fc.extentLinear()
        .accessors([d => d.lifeExpectancy])(data))
      .xLabel('Income (dollars)')
      .yLabel('Life expectancy (years)')
      .xTicks(2, d3.format(',d'))
      .chartLabel('The Wealth & Health of Nations')
      .yOrient('left')
      .plotArea(pointSeries)
      .decorate(function(selection) {
        selection.enter() // functions chained after enter are only called once
          .select('.plot-area')
          .append('svg')  // append an svg so d3-legend renders rects correctly
          .attr('class', 'legend-container');  // add class for positioning

        // functions chained after select are called whenever the chart updates
        selection.select('svg.legend-container').call(legend);
      });

  d3.select('#bubble-chart')
      .text(null) // Remove the loading text from the container
      .datum(data)
      .call(chart);
});
