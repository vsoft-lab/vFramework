
var express = require('express'), 
    proto = require('./application'),
    fs = require('fs'),
    path = require('path'),
    merge = require('util')._extend,
    assert = require('assert');


var vframe = exports = module.exports = createApp;


function createApp() {
    var app = express();
    
    merge(app, proto);
    
    app.vframe = vframe;
    
    
    
    // Create a new instance of models registry per each app instance
    app.models = function() {
        return proto.models.apply(this, arguments);
    };
    
    // Create a new instance of datasources registry per each app instance
    app.datasources = app.dataSources = {};
    
    // Create a new instance of connector registry per each app instance
    app.connectors = {};
    
    
    // Register built-in connectors. It's important to keep this code
    // hand-written, so that all require() calls are static
    // and thus browserify can process them (include connectors in the bundle)
    app.connector('memory', vframe.Memory);
    app.connector('remote', vframe.Remote);
    
    
    return app;
};


/**
 * Framework version.
 */
vframe.version = require('../package.json').version;


vframe.mime = express.mime;


/*!
 * mixin 
 */
function mixin(source) {
    for (var key in source) {
        var desc = Object.getOwnPropertyDescriptor(source, key);
        // Fix for legacy (pre-ES5) browsers like PhantomJS
        if (!desc) continue;
        Object.defineProperty(vframe, key, desc);
    }
}


mixin(require('./runtime'));
mixin(require('./registry'));


mixin(express);


/*!
 * Expose additional middleware like session as vframe.*
 * This will keep the loopback API compatible with express 3.x
 *
 * ***only in node***
 */
if (vframe.isServer) {
    var middlewares = require('./express-middleware');
    mixin(middlewares);
}


/*!
 * Expose additional vframe middleware
 * for example `vframe.configure` etc.
 *
 * ***only in node***
 */
if (vframe.isServer) {
    fs
        .readdirSync(path.join(__dirname, 'middleware'))
        .filter(function (file) {
            return file.match(/\.js$/);
        })
        .forEach(function (m) {
            vframe[m.replace(/\.js$/, '')] = require('./middleware/' + m);
        });
}


/*!
 * Error handler title
 */
vframe.errorHandler.title = 'vFrame handler Error';



/**
 * Add a remote method to a model.
 * @param {Function} fn
 * @param {Object} options (optional)
 */
vframe.remoteMethod = function (fn, options) {
    fn.shared = true;
    if(typeof options === 'object') {
        Object.keys(options).forEach(function (key) {
            fn[key] = options[key];
        });
    }
    
    fn.http = fn.http || {verb: 'get'};
};


/*!
 * Built in models / services
 */
require('./builtin-models')(vframe);
