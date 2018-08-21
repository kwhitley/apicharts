import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import path from 'object-path'
import ReactEcharts from 'echarts-for-react'
import { getMilliseconds } from 'supergeneric/time'
import baseConfigs from './baseConfigs'

const STREAM_LENGTH = 400

const datastream = []

class ApiChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: false,
      success: false,
      response: undefined,
      config: {},
      data: [],
      seriesData: [],
      isPolling: false,
      isLoaded: false,
    }

    this.fetchData = this.fetchData.bind(this)
    this.receiveData = this.receiveData.bind(this)
    this.getSeries = this.getSeries.bind(this)
    this.setChart = this.setChart.bind(this)
  }

  // pushData(series, )

  async fetchData(source) {
    let { isPolling } = this.state
    let { type, dataPath, formatter, polling, getFeed, getFeedItem } = this.props

    if (!source) {
      return false
    }

    // console.log(`loading data from ${url}...`)

    let useUrl = this.useFetcher ? ('/api/fetch?url=' + source) : source

    try {
      let response = await axios.get(useUrl).then(r => r.data)
      let data = dataPath ? path.get(response, dataPath) : response
      data = getFeed ? getFeed(data) : response

      if (data && getFeedItem) {
        data = data.map(getFeedItem)
      }

      this.receiveData(data)

      if (polling && !this.poller) {
        // console.log('polling enabled, setting polling interval of', pollingInterval, 'seconds')
        this.poller = setInterval(() => this.fetchData(source), getMilliseconds(polling) || 10000)
        this.chart && this.setState({ isPolling: true })
      }
    } catch(err) {
      if (!this.useFetcher) {
        this.useFetcher = true
        this.fetchData(source) // try again with fetcher when CORS blocked
      }
      console.warn(err)
    }
  }

  getSeries(data) {
    let { series, timeseries, autodetect } = this.props

    if (!data || !data.length) {
      return []
    }

    let seriesData = series.map(s => {
      let { xPath, yPath, name } = s

      if (!xPath && timeseries && autodetect) {
        xPath = Object.keys(data[0]).find(k => k.toLowerCase().includes('time') || k.toLowerCase().includes('date'))
      }

      let y = data.map(d => d[yPath])
      let x = data.map((d, i) => xPath ? d[xPath] : i)

      if (timeseries) {
        x = x.map(v => new Date(v))
      }

      return { name, data: { x, y } }
    })

    return seriesData
  }

  receiveData(data) {
    let { series, stacked, timeseries } = this.props
    let exampleRow = data && data.length ? data[0] : {}
    let config = baseConfigs.timeseries(this.props)

    if (!data || !data.length) {
      return []
    }

    series.forEach(s => {
      let { path, label, lines = [], color, fill } = s
      let xpath = Object.keys(exampleRow).includes(timeseries) ? timeseries : undefined

      if (timeseries && !xpath) {
        xpath = Object.keys(data[0]).find(k => k.toLowerCase().includes('time') || k.toLowerCase().includes('date'))
      }

      lines = lines.map(line => ({
        type: line.type || line,
        name: line.type || line,
        label: {
          // formatter: `{b}\n{c}`,
          // fontSize: 10,
        },
        lineStyle: {
          color
        }
      }))

      let extendedSeries = Object.assign({
        name: label,
        type: 'line',
        smooth: true,
        animation: Boolean(s.animation),
        showSymbol: false,
        symbolSize: s.type === 'scatter' ? 3 : 10,
        hoverAnimation: false,
        data: data.map(r => [r[xpath], r[path]]),
        markLine: {
          data: lines
        },
        stack: stacked,
        areaStyle: fill ? {
          opacity: fill || 0.4
        } : undefined,
        yAxisIndex: s.yAxis === 'right' ? 1 : undefined,
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
      }, s)

      config.series.push(extendedSeries)
    })

    this.chart && this.setState({ config })
  }

  shouldComponentUpdate(nextProps, nextState) {
    let { isLoaded, seriesData } = this.state

    if (nextProps !== this.props) {
      this.fetchData(nextProps.url)
    }

    return true
  }

  componentWillMount() {
    let { url } = this.props

    url && this.fetchData(url)

    console.log('apichart mounted')
  }

  componentWillUnmount() {
    this.chart && this.chart.dispose()
    this.chart = undefined

    console.log('apichart unmounted')
  }

  setChart(chart) {
    let { events, callback } = this.props

    window.chart = this.chart = chart

    Object.keys(events || {}).forEach(eventName => {
      chart.on(eventName, (event) => events[eventName](event, chart))
    })

    // register callbacks on chart
    callback && callback(chart)
  }

  render() {
    return <ReactEcharts
            style={{ height: '100%' }}
            option={this.state.config}
            onChartReady={this.setChart}
          />
  }
}

ApiChart.defaultProps = {
  zerobased: true,
  isPolling: false,
  pollingInterval: 1000,
}

export default ApiChart
