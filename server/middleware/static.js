
/**
 * Serve static assets of a vframe application.
 *
 * @param {string} root The root directory from which the static assets are to
 * be served.
 * @param {object} options Refer to
 * [express documentation](http://expressjs.com/4x/api.html#express.static)
 * for the full list of available options.
 * @header vframe.static(root, [options])
 */
module.exports = require('express').static;
