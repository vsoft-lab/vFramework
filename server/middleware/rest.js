/*!
 * Module dependencies.
 */
var vframe = require('../../lib/vframe');
var async = require('async');
/*!
 * Export the middleware.
 */
module.exports = rest;
/**
 * Expose models over REST.
 *
 * For example:
 * ```js
 * app.use(vframe.rest());
 * ```
 * For more information, see [Exposing models over a REST API](http://docs.strongloop.com/display/DOC/Exposing+models+over+a+REST+API).
 * @header vframe.rest()
 */
function rest() {
    return function restApiHandler(req, res, next) {
        var app = req.app;
        var restHandler = app.handler('rest');
        if (req.url === '/routes') {
            return res.send(restHandler.adapter.allRoutes());
        } else if (req.url === '/models') {
            return res.send(app.remotes().toJSON());
        }
        var preHandlers;
        if (!preHandlers) {
            preHandlers = [];
            var remotingOptions = app.get('remoting') || {};
            var contextOptions = remotingOptions.context;
            if (contextOptions !== false) {
                if (typeof contextOptions !== 'object')
                    contextOptions = {};
                preHandlers.push(vframe.context(contextOptions));
            }
            if (app.isAuthEnabled) {
                // NOTE(bajtos) It would be better to search app.models for a model
                // of type AccessToken instead of searching all loopback models.
                // Unfortunately that's not supported now.
                // Related discussions:
                var AccessToken = vframe.getModelByType(vframe.AccessToken);
                preHandlers.push(vframe.token({ model: AccessToken }));
            }
        }
        
        async.eachSeries(preHandlers.concat(restHandler), function(handler, done) {
            handler(req, res, done);
        }, next);
    };
}
