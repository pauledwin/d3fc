// create some test data
const stream = fc.randomFinancial().stream();
const data = stream.take(110);

function renderChart() {
  // add a new datapoint and remove an old one
  data.push(stream.next());
  data.shift();

  const container = d3.select('#streaming-chart');

  // Create and apply the bollinger algorithm
  const bollingerAlgorithm = fc.indicatorBollingerBands().value(d => d.close);
  const bollingerData = bollingerAlgorithm(data);
  const mergedData = data.map((d, i) => Object.assign({}, d, {
    bollinger: bollingerData[i]
  }));

  // Offset the range to include the full bar for the latest value
  const DAY_MS = 1000 * 60 * 60 * 24;
  const xExtent = fc.extentDate()
    .accessors([d => d.date])
    .padUnit('domain')
    .pad([DAY_MS * -bollingerAlgorithm.period()(mergedData), DAY_MS]);

  // ensure y extent includes the bollinger bands
  const yExtent = fc.extentLinear()
    .accessors([
      d => Math.max(d.bollinger.upper, d.high),
      d => Math.min(d.bollinger.lower, d.low)
    ]);

  // create a chart
  const chart = fc.chartSvgCartesian(
    d3.scaleTime(),
    d3.scaleLinear()
  )
   .xDomain(xExtent(mergedData))
   .yDomain(yExtent(mergedData))
   .yNice()
   .chartLabel('Streaming Candlestick');

  // Create the gridlines and series
  const gridlines = fc.annotationSvgGridline();
  const candlestick = fc.seriesSvgCandlestick();

  const bollingerBands = () => {
    const area = fc.seriesSvgArea()
      .mainValue((d, i) => d.bollinger.upper)
      .baseValue((d, i) => d.bollinger.lower);

    const upperLine = fc.seriesSvgLine()
      .mainValue((d, i) => d.bollinger.upper);

    const averageLine = fc.seriesSvgLine()
      .mainValue((d, i) => d.bollinger.average);

    const lowerLine = fc.seriesSvgLine()
      .mainValue((d, i) => d.bollinger.lower);

    const crossValue = d => d.date;
    area.crossValue(crossValue);
    upperLine.crossValue(crossValue);
    averageLine.crossValue(crossValue);
    lowerLine.crossValue(crossValue);

    const bollingerMulti = fc.seriesSvgMulti()
      .series([area, upperLine, lowerLine, averageLine])
      .decorate((g, datum, index) => {
        g.enter()
          .attr('class', (d, i) =>
            'multi bollinger ' + ['area', 'upper', 'lower', 'average'][i]
          );
      });

    return bollingerMulti;
  };

  // add them to the chart via a multi-series
  const multi = fc.seriesSvgMulti()
    .series([gridlines, bollingerBands(), candlestick]);

  chart.plotArea(multi);

  container
    .style('margin-left', '20px')
    .datum(mergedData)
    .call(chart);
}

// re-render the chart every 200ms
renderChart();

if (window.intervalId) {
  window.clearInterval(window.intervalId);
}
window.intervalId = setInterval(renderChart, 200);
