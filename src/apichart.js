import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import path from 'object-path'
import ReactEcharts from 'echarts-for-react'
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
      isLoaded: false
    }

    this.fetchData = this.fetchData.bind(this)
    this.receiveData = this.receiveData.bind(this)
    this.getSeries = this.getSeries.bind(this)
    this.setChart = this.setChart.bind(this)

    // console.log('creating chart instance')
    this.fetchData({ url: this.props.url })
  }

  async fetchData({ useFetcher = false, url = undefined }) {
    let { isPolling } = this.state
    let { type, dataPath, formatter, pollingEnabled, pollingInterval } = this.props

    if (!url) {
      return false
    }

    // console.log(`loading data from ${url}...`)

    let useUrl = useFetcher ? ('/api/fetch?url=' + url) : url

    try {
      let response = await axios.get(useUrl).then(r => r.data)
      let data = dataPath ? path.get(response, dataPath) : response

      if (data && formatter) {
        data = data.map(formatter)
      }

      data.reverse()
      this.receiveData(data)

      if (pollingEnabled && !this.poller) {
        // console.log('polling enabled, setting polling interval of', pollingInterval, 'seconds')
        this.poller = setInterval(() => this.fetchData({ url, useFetcher }), pollingInterval)
        this.setState({ isPolling: true })
      }
    } catch(err) {
      if (!useFetcher) {
        this.fetchData({ useFetcher: true, url }) // try once with fetcher when CORS blocked
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
    let { series, stacked } = this.props

    let config = baseConfigs.timeseries(this.props)

    if (!data || !data.length) {
      return []
    }

    // if (timeseries && autodetect) {
    //   config.xAxis.type = 'time'
    //   let xPath = Object.keys(data[0]).find(k => k.toLowerCase().includes('time') || k.toLowerCase().includes('date'))

    //   config.xAxis.data = data.map(r => new Date(r[xPath]))
    // }

    series.forEach(s => {
      let { path, label, lines = [], color, fill } = s

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
        color: '#f0f',
        animation: Boolean(s.animation),
        showSymbol: false,
        symbolSize: s.type === 'scatter' ? 3 : 10,
        hoverAnimation: false,
        data: data.map(r => [r.openTime, r[path]]),
        markLine: {
          data: lines
        },
        stack: stacked,
        areaStyle: fill ? {
          opacity: fill || 0.4
        } : undefined,
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

    this.setState({ config })
  }

  shouldComponentUpdate(nextProps, nextState) {
    let { isLoaded, seriesData } = this.state

    if (nextProps.url !== this.props.url) {
      console.log('shouldComponentUpdate:fetching data...')
      this.fetchData({ url: nextProps.url })
    } else {
      // return true// this.updateChartData(nextState, nextProps)
    }

    return true
  }


  componentWillUnmount() {
    console.log('unmounted chart instance')

    this.chart && this.chart.dispose()
  }

  setChart(chart) {
    window.chart = this.chart = chart
  }

  render() {
    // console.log('rendering chart...', this.state.config)

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
