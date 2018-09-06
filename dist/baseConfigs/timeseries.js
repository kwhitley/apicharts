'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  return hasMultipleAxis(series) ? 0 : hasLines(series) ? 35 : 0;
};
var hasMultipleAxis = function hasMultipleAxis(series) {
  return Boolean(series.find(function (s) {
    return s.yAxis === 'right';
  }));
};

var getYAxis = function getYAxis(series, timeseries, yAxis, autoscale) {
  var axis = {
    show: Boolean(yAxis),
    scale: autoscale,
    splitLine: {
      show: yAxis && yAxis.grid
    },
    splitNumber: yAxis && yAxis.ticks || 1,
    splitArea: {
      show: yAxis && yAxis.area
    },
    name: yAxis && yAxis.label,
    nameTextStyle: {
      align: 'center',
      fontWeight: 'bold'
    }
  };

  var axis2 = (0, _assign2.default)({}, axis, {
    name: yAxis && yAxis.labelRight
  });

  return hasMultipleAxis(series) ? [axis, axis2] : axis;
};

exports.default = function (_ref) {
  var animation = _ref.animation,
      autoscale = _ref.autoscale,
      colors = _ref.colors,
      legend = _ref.legend,
      series = _ref.series,
      timeseries = _ref.timeseries,
      title = _ref.title,
      tooltip = _ref.tooltip,
      xAxis = _ref.xAxis,
      yAxis = _ref.yAxis,
      zoomable = _ref.zoomable,
      zoomslider = _ref.zoomslider;
  return {
    animation: animation === false ? false : true,
    title: {
      text: title,
      top: 5,
      x: 'center'
    },
    color: colors || ['#383', '#68e', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
    grid: {
      containLabel: true,
      top: 20 + getTitleHeight(title) + getLegendHeight(legend),
      left: 20 + getYAxisWidth(yAxis),
      right: 20 + (getYAxisWidth(yAxis) || getMarkLineWidth(series)),
      bottom: 20 + getDataZoomHeight(zoomslider) + getXAxisHeight(xAxis),
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
      type: Boolean(timeseries) ? 'time' : 'category',
      name: xAxis && xAxis.label,
      nameTextStyle: {
        align: 'center',
        fontWeight: 'bold'
      },
      splitLine: {
        show: xAxis && xAxis.grid
      },
      splitNumber: xAxis && xAxis.ticks,
      splitArea: {
        show: xAxis && xAxis.area
      }
    },
    yAxis: getYAxis(series, timeseries, yAxis, autoscale),
    dataZoom: [{
      type: 'inside',
      disabled: !Boolean(zoomable)
    }, {
      type: 'slider',
      show: Boolean(zoomslider)
    }],
    series: []
  };
};