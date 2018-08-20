const getXAxisHeight = xAxis => 0//xAxis ? 30 : 0
const getDataZoomHeight = datazoom => datazoom ? 25 : 0
const getTitleHeight = title => title ? 30 : 0
const getLegendHeight = legend => legend ? 15 : 0

const getYAxisWidth = yAxis => 0//yAxis ? 40 : 0
const hasLines = series => Boolean(series.find(s => s.lines && s.lines.length))
const getMarkLineWidth = series => hasMultipleAxis(series) ? 0 : (hasLines(series) ? 35 : 0)
const hasMultipleAxis = series => Boolean(series.find(s => s.yAxis === 'right'))

const getYAxis = (series, timeseries, yAxis, autoscale) => {
  let axis = {
    show: Boolean(yAxis),
    scale: autoscale,
    splitLine: {
      show: yAxis && yAxis.grid,
    },
    splitNumber: yAxis && yAxis.ticks || 1,
    splitArea: {
      show: yAxis && yAxis.area,
    },
    name: yAxis && yAxis.label,
    nameTextStyle: {
      align: 'center',
      fontWeight: 'bold',
    },
  }

  let axis2 = Object.assign({}, axis, {
    name: yAxis && yAxis.labelRight,
  })

  return hasMultipleAxis(series) ? [axis, axis2] : axis
}

export default ({
  animation,
  autoscale,
  colors,
  legend,
  series,
  timeseries,
  title,
  tooltip,
  xAxis,
  yAxis,
  zoomable,
  zoomslider,
}) => ({
  animation: animation === false ? false : true,
  title: {
    text: title,
    top: 5,
    x: 'center',
  },
  color: colors || ['#383','#68e', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
  grid: {
    containLabel: true,
    top: 20 + getTitleHeight(title) + getLegendHeight(legend),
    left: 20 + getYAxisWidth(yAxis),
    right: 20 + (getYAxisWidth(yAxis) || getMarkLineWidth(series)),
    bottom: 20 + getDataZoomHeight(zoomslider) + getXAxisHeight(xAxis),
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
    type: Boolean(timeseries) ? 'time' : 'category',
    name: xAxis && xAxis.label,
    nameTextStyle: {
      align: 'center',
      fontWeight: 'bold',
    },
    splitLine: {
      show: xAxis && xAxis.grid
    },
    splitNumber: xAxis && xAxis.ticks,
    splitArea: {
      show: xAxis && xAxis.area,
    },
  },
  yAxis: getYAxis(series, timeseries, yAxis, autoscale),
  dataZoom: [{
    type: 'inside',
    disabled: !Boolean(zoomable),
  }, {
    type: 'slider',
    show: Boolean(zoomslider),
  }],
  series : [],
})
