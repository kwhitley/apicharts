import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import path from 'object-path'
import Chart from 'react-c3-component'
// import 'c3/c3.css'

class ApiChart extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: false,
      success: false,
      response: undefined,
      data: [],
      extent: undefined,
      seriesData: [],
    }

    this.fetchData()

    this.setExtent = this.setExtent.bind(this)
  }

  async fetchData(useFetcher = false) {
    let { url, dataPath, formatter } = this.props

    if (!url) {
      return false
    }

    console.log(`loading data from ${url}...`)

    let useUrl = useFetcher ? ('/api/fetch?url=' + url) : url

    try {
      let response = await axios.get(useUrl).then(r => r.data)
      // console.log('response', response)
      let data = dataPath ? path.get(response, dataPath) : response

      // console.log('data', data)
      if (data && formatter) {
        // console.log('data', data)
        // console.log('formatter', formatter)
        data = data.map(formatter)

        // console.log('transformed', data)
      }

      let seriesData = this.getSeries(data)

      // console.log('seriesData', seriesData)

      this.setState({ response, data, seriesData })
    } catch(err) {
      if (!useFetcher) {
        this.fetchData(true) // try once with fetcher when CORS blocked
      }
      console.warn(err)
    }
  }

  componentDidUpdate({ url }) {
    if (url !== this.props.url) {
      this.fetchData()
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

      return { name, values: { x, y } }
    })

    return seriesData
  }

  setExtent(extent) {
    console.log('setting extent', extent)
    this.setState({ extent })

    return true
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   let { url, type } = this.props
  //   return nextProps.url !== url || nextProps.type !== type
  // }

  render() {
    let { title, type, zerobased } = this.props
    let { seriesData, extent } = this.state
    let columns = seriesData.map(s => ([s.name, ...s.values.y]))

    if (seriesData.length) {
      columns.unshift(['x', ...seriesData[0].values.x])
    }

    return (
      <div>
        {
          title && <h3>{ title }</h3>
        }
        <Chart config={{
          chart: {
            color: {
              pattern: ['#114B5F', '#028090', '#456990', '#F45B69' ]
            }
          },
          data: {
            type,
            x: 'x',
            columns,
            selection: {
              enabled: true,
              draggable: true
            }
          },
          grid: {
            x: {
              show: true,
              lines: [
                { value: new Date(new Date - 10000), text: 'Today' },
              ]
            }
          },
          point: {
            show: false
          },
          zoom: {
            enabled: true,
            rescale: true,
            // onzoomend: this.setExtent,
            // extent
          },
          bar: {
            zerobased
          },
          area: {
            zerobased
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
              onclick: (id) => console.log(`clicked on legend:${id}`)
            }
          }
        }} />
      </div>
    )
  }
}

ApiChart.defaultProps = {
  zerobased: true,
}

export default ApiChart
