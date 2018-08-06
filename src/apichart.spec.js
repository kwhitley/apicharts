import { expect } from 'chai'
import ApiChart from './Apichart'

describe('react-wrappers', function() {
  it('exposes default export as React function', function() {
    expect(typeof ApiChart).to.equal('function')
  })
})
