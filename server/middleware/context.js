
var vframe = require('../../lib/vframe');
var juggler = require('vsoft-datasource-juggler');
// var remoting = require('vremoting');
var remoting = require('strong-remoting');
var cls = require('continuation-local-storage');

module.exports = context;

var name = 'vframe';

function createContext(scope) {
    // Make the namespace globally visible via the process.context property
    process.context = process.context || {};
    var ns = process.context[scope];
    if (!ns) {
        ns = cls.createNamespace(scope);
        process.context[scope] = ns;
        // Set up vframe.getCurrentContext()
        vframe.getCurrentContext = function() {
            return ns && ns.active ? ns : null;
        };
        chain(juggler);
        chain(remoting);
    }
    return ns;
}
/**
 * Context middleware.
 * ```js
 * var app = vframe();
 * app.use(vframe.context(options);
 * app.use(vframe.rest());
 * app.listen();
 * ```
 * @options {Object} [options] Options for context
 * @property {String} name Context scope name.
 * @property {Boolean} enableHttpContext Whether HTTP context is enabled. Default is false.
 * @header vframe.context([options])
 */
function context(options) {
    options = options || {};
    var scope = options.name || name;
    var enableHttpContext = options.enableHttpContext || false;
    var ns = createContext(scope);
    // Return the middleware
    return function contextHandler(req, res, next) {
        if (req.vframeContext) {
            return next();
        }
        req.vframeContext = ns;
        // Bind req/res event emitters to the given namespace
        ns.bindEmitter(req);
        ns.bindEmitter(res);
        // Create namespace for the request context
        ns.run(function processRequestInContext(context) {
            // Run the code in the context of the namespace
            if (enableHttpContext) {
                ns.set('http', {req: req, res: res}); // Set up the transport context
            }
            next();
        });
    };
}
/**
 * Create a chained context
 * @param {Object} child The child context
 * @param {Object} parent The parent context
 * @private
 * @constructor
 */
function ChainedContext(child, parent) {
    this.child = child;
    this.parent = parent;
}
/*!
 * Get the value by name from the context. If it doesn't exist in the child
 * context, try the parent one
 * @param {String} name Name of the context property
 * @returns {*} Value of the context property
 */
ChainedContext.prototype.get = function(name) {
    var val = this.child && this.child.get(name);
    if (val === undefined) {
        return this.parent && this.parent.get(name);
    }
};
ChainedContext.prototype.set = function(name, val) {
    if (this.child) {
        return this.child.set(name, val);
    } else {
        return this.parent && this.parent.set(name, val);
    }
};
ChainedContext.prototype.reset = function(name, val) {
    if (this.child) {
        return this.child.reset(name, val);
    } else {
        return this.parent && this.parent.reset(name, val);
    }
};
function chain(child) {
    if (typeof child.getCurrentContext === 'function') {
        var childContext = new ChainedContext(child.getCurrentContext(),
                                              vframe.getCurrentContext());
        child.getCurrentContext = function() {
            return childContext;
        };
    } else {
        child.getCurrentContext = vframe.getCurrentContext;
    }
}
