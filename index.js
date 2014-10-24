
var vframe = module.exports = require('./lib/vframe');
var datasourceJuggler = require('vsoft-datasource-juggler');


/**
 * Connector
 */

vframe.Connector = require('./lib/connectors/base-connector');
vframe.Memory = require('./lib/connectors/memory');
vframe.Mail = require('./lib/connectors/mail');
vframe.Remote = require('vsoft-connector-remote');



/**
 * Type
 */
vframe.ValidationError = vframe.Model.ValidationError;

