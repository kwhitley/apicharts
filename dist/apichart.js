'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

var _reactC3Component = require('react-c3-component');

var _reactC3Component2 = _interopRequireDefault(_reactC3Component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import 'c3/c3.css'

var ApiChart = function (_Component) {
  _inherits(ApiChart, _Component);

  function ApiChart(props) {
    _classCallCheck(this, ApiChart);

    var _this = _possibleConstructorReturn(this, (ApiChart.__proto__ || Object.getPrototypeOf(ApiChart)).call(this, props));

    _this.state = {
      fetching: false,
      success: false,
      response: undefined,
      data: [],
      extent: undefined,
      seriesData: []
    };

    _this.fetchData();

    _this.setExtent = _this.setExtent.bind(_this);
    return _this;
  }

  _createClass(ApiChart, [{
    key: 'fetchData',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var useFetcher = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var _props, url, dataPath, formatter, useUrl, response, data, seriesData;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _props = this.props, url = _props.url, dataPath = _props.dataPath, formatter = _props.formatter;

                if (url) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', false);

              case 3:

                console.log('loading data from ' + url + '...');

                useUrl = useFetcher ? '/api/fetch?url=' + url : url;
                _context.prev = 5;
                _context.next = 8;
                return _axios2.default.get(useUrl).then(function (r) {
                  return r.data;
                });

              case 8:
                response = _context.sent;

                // console.log('response', response)
                data = dataPath ? _objectPath2.default.get(response, dataPath) : response;

                // console.log('data', data)

                if (data && formatter) {
                  // console.log('data', data)
                  // console.log('formatter', formatter)
                  data = data.map(formatter);

                  // console.log('transformed', data)
                }

                seriesData = this.getSeries(data);

                // console.log('seriesData', seriesData)

                this.setState({ response: response, data: data, seriesData: seriesData });
                _context.next = 19;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context['catch'](5);

                if (!useFetcher) {
                  this.fetchData(true); // try once with fetcher when CORS blocked
                }
                console.warn(_context.t0);

              case 19:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[5, 15]]);
      }));

      function fetchData() {
        return _ref.apply(this, arguments);
      }

      return fetchData;
    }()
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(_ref2) {
      var url = _ref2.url;

      if (url !== this.props.url) {
        this.fetchData();
      }
    }
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
          xPath = Object.keys(data[0]).find(function (k) {
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

        return { name: name, values: { x: x, y: y } };
      });

      return seriesData;
    }
  }, {
    key: 'setExtent',
    value: function setExtent(extent) {
      console.log('setting extent', extent);
      this.setState({ extent: extent });

      return true;
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //   let { url, type } = this.props
    //   return nextProps.url !== url || nextProps.type !== type
    // }

  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          title = _props3.title,
          type = _props3.type,
          zerobased = _props3.zerobased;
      var _state = this.state,
          seriesData = _state.seriesData,
          extent = _state.extent;

      var columns = seriesData.map(function (s) {
        return [s.name].concat(_toConsumableArray(s.values.y));
      });

      if (seriesData.length) {
        columns.unshift(['x'].concat(_toConsumableArray(seriesData[0].values.x)));
      }

      return _react2.default.createElement(
        'div',
        null,
        title && _react2.default.createElement(
          'h3',
          null,
          title
        ),
        _react2.default.createElement(_reactC3Component2.default, { config: {
            chart: {
              color: {
                pattern: ['#114B5F', '#028090', '#456990', '#F45B69']
              }
            },
            data: {
              type: type,
              x: 'x',
              columns: columns,
              selection: {
                enabled: true,
                draggable: true
              }
            },
            grid: {
              x: {
                show: true,
                lines: [{ value: new Date(new Date() - 10000), text: 'Today' }]
              }
            },
            point: {
              show: false
            },
            zoom: {
              enabled: true,
              rescale: true
              // onzoomend: this.setExtent,
              // extent
            },
            bar: {
              zerobased: zerobased
            },
            area: {
              zerobased: zerobased
            },
            axis: {
              x: {
                type: 'timeseries',
                tick: {
                  format: '%Y-%m-%d'
                }
              }
            },
            legend: {
              item: {
                onclick: function onclick(id) {
                  return console.log('clicked on legend:' + id);
                }
              }
            }
          } })
      );
    }
  }]);

  return ApiChart;
}(_react.Component);

ApiChart.defaultProps = {
  zerobased: true
};

exports.default = ApiChart;