apicharts (warning: preproduction = API changing constantly, stay tuned)
=======
#### Displaying charts from an API feed should be easy.  Now it is.

[![npm version](https://badge.fury.io/js/apicharts.svg)](https://www.npmjs.com/package/apicharts)
[![node version support](https://img.shields.io/node/v/apicharts.svg)](https://www.npmjs.com/package/apicharts)
[![Build Status via Travis CI](https://travis-ci.org/kwhitley/apicharts.svg?branch=master)](https://travis-ci.org/kwhitley/apicharts)
[![Coverage Status](https://coveralls.io/repos/github/kwhitley/apicharts/badge.svg?branch=master)](https://coveralls.io/github/kwhitley/apicharts?branch=master)
[![NPM downloads](https://img.shields.io/npm/dt/apicharts.svg?style=flat-square)](https://www.npmjs.com/package/apicharts)

## Why?
Because sometimes we just need to visualize our data quickly and can't be
bothered to wire up the fetching/data-loading process.  ApiChart handles it for you.

### Example Usage 1 (local API, no data transforms needed)
```js
<ApiChart
  type="spline"
  url="/api/snapshot/NEOBTC"
  dataPath="history"
  series={[
    { name: 'high', yPath: 'high' },
    { name: 'low', yPath: 'low' },
    { name: 'open', yPath: 'open' },
    { name: 'close', yPath: 'close' },
  ]}
  zerobased={false}
  timeseries
  autodetect
/>
```

### Example Usage 2 (remote API, some data transforms needed)
```js
<ApiChart
  title="ETH/BTC Spline"
  type="area"
  url="https://api.binance.com/api/v1/klines?symbol=NEOBTC&interval=1h&limit=240"
  formatter={
    (v) => ({
      date: v[0],
      close: v[4],
    })
  }
  series={[
    { name: 'close', yPath: 'close' },
  ]}
  autodetect
  timeseries
/>
```

### Disclaimer: **NOT** production ready.  Implementation docs/API to follow...
