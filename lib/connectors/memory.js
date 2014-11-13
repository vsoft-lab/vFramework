/**
 * Expose `Memory`.
 */
module.exports = Memory;


/**
 * Module dependencies.
 */
var Connector = require('./base-connector'),
    debug = require('debug')('memory'),
    util = require('util'),
    inherits = util.inherits,
    assert = require('assert'),
    JdbMemory = require('vsoft-datasource-juggler/lib/connectors/memory');


/**
 * Tạo một connector `Memory` mới tham số `options` nhận vào.
 *
 * @param {Object} options
 * @return {Memory}
 */
function Memory() {
    // TODO implement entire memory connector
};

/**
 * Kế thừa từ `DBConnector`
 * 
 */
inherits(Memory, Connector);


/**
 * JugglingDB Compatibility
 */
Memory.initialize = JdbMemory.initialize;
