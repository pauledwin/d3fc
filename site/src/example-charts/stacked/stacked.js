d3.csv('https://d3fc.io/examples/stacked/data.csv', (error, data) => {
  if (error) {
    return;
  }
  // manipulate the data into stacked series
  const spread = fc.group()
    .key('Country');
  const stackLayout = d3.stack()
    .keys(c => {
      return c.map(d => d.key);
    })
    .value((v, key) => {
      console.log(v, key, v[key]);
      return v;
    });

  const series = stackLayout(spread(data));

  const color = d3.schemeCategory20;
    // .domain(series.map(s => s.key));

  const yExtent = fc.extentLinear()
    .include(0)
    .accessors([a => a.map(d => d.y + d.y0)]);

  const legend = d3.legendColor()
    .orient('horizontal')
    .shapeWidth(70)
    .scale(d3.scaleOrdinal(color));

  const stack = fc.seriesSvgBar()
    .orient('horizontal')
    .mainValue(d => d.x)
    .crossValue(d => d.y0 + d.y)
    // .x0Value(d => d.y0)
    .decorate((sel, _, index) => {
      sel.enter().attr('fill', color(series[index].key));
    });

  const chart = fc.chartSvgCartesian(
    d3.scaleLinear(),
    d3.scaleOrdinal()
  )
    .xDomain(yExtent(series.map(d => d.values)))
    .yDomain(data.map(d => d.Country))
    .xLabel('(million tonnes of oil equivalent)')
    .xNice()
    .chartLabel('2013 Energy Production')
    .yOrient('left')
    // .yTickSize(0)
    // .margin({left: 100, bottom: 40, right: 10, top: 30})
    .plotArea(stack)
    .decorate(selection => {
      // add a container for the legend
      selection.enter()
        .append('g')
        .classed('legend-container', true)
        .style({
          position: 'absolute',
          right: 10,
          top: 40,
          width: 358,
          height: 36
        });

      // compute layout from the parent SVG
      selection.enter();

      // render the legend
      selection.select('g.legend-container')
        .style('display', function() {
          // magic number because the legend accessors return
          // the legend itself instead of the values (susielu/d3-legend#23)
          const availableWidth = selection.select('.plot-area')
          // .layout('width');
          return availableWidth > (75 + 5) * data.length ? '' : 'none';
        })
        .call(legend);
    });

  // render
  d3.select('#stacked-chart')
    .datum(series)
    .call(chart);
});
