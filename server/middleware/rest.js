/*!
 * Module dependencies.
 */
var vframe = require('../../lib/vframe');


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
    var tokenParser = null;
    
    return function (req, res, next) {
        
        var app = req.app;
        var handler = app.handler('rest');
        
        if(req.url === '/routes') {
            res.send(handler.adapter.allRoutes());
            
        } else if(req.url === '/models') {
            return res.send(app.remotes().toJSON());
            
        } else if (app.isAuthEnabled) {
            

            
            if (!tokenParser) {
                // NOTE(bajtos) It would be better to search app.models for a model
                // of type AccessToken instead of searching all loopback models.
                // Unfortunately that's not supported now.
                var AccessToken = vframe.getModelByType(vframe.AccessToken);
                tokenParser = vframe.token({ model: AccessToken });
                
                // console.log(tokenParser);

            }
            
            tokenParser(req, res, function(err) {
                if (err) {
                    next(err);
                } else {
                    handler(req, res, next);
                }
            });

        } else {
            handler(req, res, next);
        }
    };
}
