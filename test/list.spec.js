const expect = require('chai').expect
const list = require('../list')()

describe('List', () => {
  it('has 10 results', () => {
    return list().then((results) => {
      expect(results.length).to.eq(10)
    })
  })
})
