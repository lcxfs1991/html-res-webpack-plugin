var path = require('path');
var config = require('./src/config/config');
var webpack = require('../node_modules/webpack/');	

jest.unmock('./src/resource-inline/sum.js'); // unmock to use the actual implementation of sum

describe('sum', () => {
  it('adds 1 + 2 to equal 3', () => {
    const sum = require('./src/resource-inline/sum.js');
    expect(sum(1, 2)).toBe(3);
  });
});