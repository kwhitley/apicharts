'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getXAxisHeight = function getXAxisHeight(xAxis) {
  return 0;
}; //xAxis ? 30 : 0
var getDataZoomHeight = function getDataZoomHeight(datazoom) {
  return datazoom ? 25 : 0;
};
var getTitleHeight = function getTitleHeight(title) {
  return title ? 30 : 0;
};
var getLegendHeight = function getLegendHeight(legend) {
  return legend ? 15 : 0;
};

var getYAxisWidth = function getYAxisWidth(yAxis) {
  return 0;
}; //yAxis ? 40 : 0
var hasLines = function hasLines(series) {
  return Boolean(series.find(function (s) {
    return s.lines && s.lines.length;
  }));
};
var getMarkLineWidth = function getMarkLineWidth(series) {
  return hasLines(series) ? 35 : 0;
};

exports.default = function (_ref) {
  var title = _ref.title,
      autoscale = _ref.autoscale,
      datazoom = _ref.datazoom,
      legend = _ref.legend,
      tooltip = _ref.tooltip,
      xAxis = _ref.xAxis,
      yAxis = _ref.yAxis,
      series = _ref.series,
      zoomable = _ref.zoomable,
      rangeslider = _ref.rangeslider;
  return {
    animation: true,
    title: {
      text: title,
      top: 5,
      x: 'center'
    },
    grid: {
      containLabel: true,
      top: 20 + getTitleHeight(title) + getLegendHeight(legend),
      left: 20 + getYAxisWidth(yAxis),
      right: 20 + (getYAxisWidth(yAxis) || getMarkLineWidth(series)),
      bottom: 20 + getDataZoomHeight(zoomable) + getXAxisHeight(xAxis),
      height: 'auto'
    },
    legend: {
      show: Boolean(legend),
      top: getTitleHeight(title),
      z: 0,
      zlevel: 2,
      orient: 'horizontal',
      textStyle: {
        fontFamily: 'sans-serif',
        fontSize: 10
      }
    },
    tooltip: {
      show: tooltip,
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#666',
      borderWidth: 1,
      borderRadius: 3,
      hideDelay: 1000,
      color: '#222',
      confine: true,
      extraCssText: 'color: #222 !important; font-size: 0.8em;'
    },
    xAxis: {
      show: Boolean(xAxis),
      type: 'time',
      splitLine: {
        show: xAxis && xAxis.grid
      },
      splitNumber: xAxis && xAxis.ticks,
      splitArea: {
        show: xAxis && xAxis.area
      }
    },
    yAxis: {
      show: Boolean(yAxis),
      scale: autoscale,
      splitLine: {
        show: yAxis && yAxis.grid
      },
      splitNumber: yAxis && yAxis.ticks || 1,
      splitArea: {
        show: yAxis && yAxis.area
      }
    },
    dataZoom: [{
      type: 'inside',
      show: Boolean(zoomable)
    }, {
      type: 'slider',
      show: Boolean(rangeslider)
    }],
    series: []
  };
};