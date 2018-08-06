const getXAxisHeight = xAxis => 0//xAxis ? 30 : 0
const getDataZoomHeight = datazoom => datazoom ? 25 : 0
const getTitleHeight = title => title ? 30 : 0
const getLegendHeight = legend => legend ? 15 : 0

const getYAxisWidth = yAxis => 0//yAxis ? 40 : 0
const hasLines = series => Boolean(series.find(s => s.lines && s.lines.length))
const getMarkLineWidth = series => hasLines(series) ? 35 : 0

export default ({ title, autoscale, datazoom, legend, tooltip, xAxis, yAxis, series, zoomable, rangeslider }) => ({
  animation: true,
  title: {
    text: title,
    top: 5,
    x: 'center',
  },
  grid: {
    containLabel: true,
    top: 20 + getTitleHeight(title) + getLegendHeight(legend),
    left: 20 + getYAxisWidth(yAxis),
    right: 20 + (getYAxisWidth(yAxis) || getMarkLineWidth(series)),
    bottom: 20 + getDataZoomHeight(zoomable) + getXAxisHeight(xAxis),
    height: 'auto',
  },
  legend: {
    show: Boolean(legend),
    top: getTitleHeight(title),
    z: 0,
    zlevel: 2,
    orient: 'horizontal',
    textStyle: {
      fontFamily: 'sans-serif',
      fontSize: 10,
    }
  },
  tooltip: {
    show: tooltip,
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: '#666',
    borderWidth: 1,
    borderRadius : 3,
    hideDelay: 1000,
    color: '#222',
    confine: true,
    extraCssText: `color: #222 !important; font-size: 0.8em;`,
  },
  xAxis: {
    show: Boolean(xAxis),
    type: 'time',
    splitLine: {
      show: xAxis && xAxis.grid
    },
    splitNumber: xAxis && xAxis.ticks,
    splitArea: {
      show: xAxis && xAxis.area,
    },
  },
  yAxis : {
    show: Boolean(yAxis),
    scale: autoscale,
    splitLine: {
      show: yAxis && yAxis.grid
    },
    splitNumber: yAxis && yAxis.ticks || 1,
    splitArea: {
      show: yAxis && yAxis.area,
    },
  },
  dataZoom: [{
    type: 'inside',
    show: Boolean(zoomable),
  }, {
    type: 'slider',
    show: Boolean(rangeslider),
  }],
  series : [],
})
