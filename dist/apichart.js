'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

var _echartsForReact = require('echarts-for-react');

var _echartsForReact2 = _interopRequireDefault(_echartsForReact);

var _time = require('supergeneric/time');

var _baseConfigs = require('./baseConfigs');

var _baseConfigs2 = _interopRequireDefault(_baseConfigs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STREAM_LENGTH = 400;

var datastream = [];

var ApiChart = function (_Component) {
  (0, _inherits3.default)(ApiChart, _Component);

  function ApiChart(props) {
    (0, _classCallCheck3.default)(this, ApiChart);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ApiChart.__proto__ || (0, _getPrototypeOf2.default)(ApiChart)).call(this, props));

    _this.state = {
      fetching: false,
      success: false,
      response: undefined,
      config: {},
      data: [],
      seriesData: [],
      isPolling: false,
      isLoaded: false
    };

    _this.fetchData = _this.fetchData.bind(_this);
    _this.receiveData = _this.receiveData.bind(_this);
    _this.getSeries = _this.getSeries.bind(_this);
    _this.setChart = _this.setChart.bind(_this);
    return _this;
  }

  // pushData(series, )

  (0, _createClass3.default)(ApiChart, [{
    key: 'fetchData',
    value: function () {
      var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(source) {
        var _this2 = this;

        var isPolling, _props, type, dataPath, formatter, polling, getFeed, getFeedItem, useUrl, response, data;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                isPolling = this.state.isPolling;
                _props = this.props, type = _props.type, dataPath = _props.dataPath, formatter = _props.formatter, polling = _props.polling, getFeed = _props.getFeed, getFeedItem = _props.getFeedItem;

                if (source) {
                  _context.next = 4;
                  break;
                }

                return _context.abrupt('return', false);

              case 4:

                // console.log(`loading data from ${url}...`)

                useUrl = this.useFetcher ? '/api/fetch?url=' + source : source;
                _context.prev = 5;
                _context.next = 8;
                return _axios2.default.get(useUrl).then(function (r) {
                  return r.data;
                });

              case 8:
                response = _context.sent;
                data = dataPath ? _objectPath2.default.get(response, dataPath) : response;

                data = getFeed ? getFeed(data) : response;

                if (data && getFeedItem) {
                  data = data.map(getFeedItem);
                }

                this.receiveData(data);

                if (polling && !this.poller) {
                  // console.log('polling enabled, setting polling interval of', pollingInterval, 'seconds')
                  this.poller = setInterval(function () {
                    return _this2.fetchData(source);
                  }, (0, _time.getMilliseconds)(polling) || 10000);
                  this.chart && this.setState({ isPolling: true });
                }
                _context.next = 20;
                break;

              case 16:
                _context.prev = 16;
                _context.t0 = _context['catch'](5);

                if (!this.useFetcher) {
                  this.useFetcher = true;
                  this.fetchData(source); // try again with fetcher when CORS blocked
                }
                console.warn(_context.t0);

              case 20:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 16]]);
      }));

      function fetchData(_x) {
        return _ref.apply(this, arguments);
      }

      return fetchData;
    }()
  }, {
    key: 'getSeries',
    value: function getSeries(data) {
      var _props2 = this.props,
          series = _props2.series,
          timeseries = _props2.timeseries,
          autodetect = _props2.autodetect;


      if (!data || !data.length) {
        return [];
      }

      var seriesData = series.map(function (s) {
        var xPath = s.xPath,
            yPath = s.yPath,
            name = s.name;


        if (!xPath && timeseries && autodetect) {
          xPath = (0, _keys2.default)(data[0]).find(function (k) {
            return k.toLowerCase().includes('time') || k.toLowerCase().includes('date');
          });
        }

        var y = data.map(function (d) {
          return d[yPath];
        });
        var x = data.map(function (d, i) {
          return xPath ? d[xPath] : i;
        });

        if (timeseries) {
          x = x.map(function (v) {
            return new Date(v);
          });
        }

        return { name: name, data: { x: x, y: y } };
      });

      return seriesData;
    }
  }, {
    key: 'receiveData',
    value: function receiveData(data) {
      var _props3 = this.props,
          series = _props3.series,
          stacked = _props3.stacked,
          timeseries = _props3.timeseries;

      var exampleRow = data && data.length ? data[0] : {};
      var config = _baseConfigs2.default.timeseries(this.props);

      if (!data || !data.length) {
        return [];
      }

      series.forEach(function (s) {
        var path = s.path,
            label = s.label,
            _s$lines = s.lines,
            lines = _s$lines === undefined ? [] : _s$lines,
            color = s.color,
            fill = s.fill;

        var xpath = (0, _keys2.default)(exampleRow).includes(timeseries) ? timeseries : undefined;

        if (timeseries && !xpath) {
          xpath = (0, _keys2.default)(data[0]).find(function (k) {
            return k.toLowerCase().includes('time') || k.toLowerCase().includes('date');
          });
        }

        lines = lines.map(function (line) {
          return {
            type: line.type || line,
            name: line.type || line,
            label: {
              // formatter: `{b}\n{c}`,
              // fontSize: 10,
            },
            lineStyle: {
              color: color
            }
          };
        });

        var extendedSeries = (0, _assign2.default)({
          name: label,
          type: 'line',
          smooth: true,
          animation: Boolean(s.animation),
          showSymbol: false,
          symbolSize: s.type === 'scatter' ? 3 : 10,
          hoverAnimation: false,
          data: data.map(function (r) {
            return [r[xpath], r[path]];
          }),
          markLine: {
            data: lines
          },
          stack: stacked,
          areaStyle: fill ? {
            opacity: fill || 0.4
          } : undefined,
          yAxisIndex: s.yAxis === 'right' ? 1 : undefined
          // markArea: {
          //   // itemStyle: {
          //   //   // color: '#e00',
          //   // },
          //   data: [
          //     [
          //       {
          //         name: 'from min to max'
          //         // coord: ['min', 'max']
          //         type: 'min'
          //       },
          //       {
          //         type: 'max'
          //       }

          //     ]
          //   ]
          // },
        }, s);

        config.series.push(extendedSeries);
      });

      this.chart && this.setState({ config: config });
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _state = this.state,
          isLoaded = _state.isLoaded,
          seriesData = _state.seriesData;


      if (nextProps !== this.props) {
        this.fetchData(nextProps.url);
      }

      return true;
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      var url = this.props.url;


      url && this.fetchData(url);

      console.log('apichart mounted');
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.poller && clearTimeout(this.poller);

      this.chart && this.chart.dispose();
      this.chart = undefined;

      console.log('apichart unmounted');
    }
  }, {
    key: 'setChart',
    value: function setChart(chart) {
      var _props4 = this.props,
          events = _props4.events,
          callback = _props4.callback;


      window.chart = this.chart = chart;

      (0, _keys2.default)(events || {}).forEach(function (eventName) {
        chart.on(eventName, function (event) {
          return events[eventName](event, chart);
        });
      });

      // register callbacks on chart
      callback && callback(chart);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_echartsForReact2.default, {
        style: { height: '100%' },
        option: this.state.config,
        onChartReady: this.setChart
      });
    }
  }]);
  return ApiChart;
}(_react.Component);

ApiChart.defaultProps = {
  zerobased: true,
  isPolling: false,
  pollingInterval: 1000
};

exports.default = ApiChart;