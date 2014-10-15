
var express = require('express'), 
    fs = require('fs'),
    path = require('path'),
    merge = require('util')._extend,
    assert = require('assert');

var vframe = exports = module.exports = createApp;


function createApp() {
    var app = express();
    app.vframe = vframe;
    
    return app;
};




/*!
 * Expose additional loopback middleware
 * for example `vframe.configure` etc.
 *
 * ***only in node***
 */
fs
    .readdirSync(path.join(__dirname, 'middleware'))
    .filter(function (file) {
        return file.match(/\.js$/);
    })
    .forEach(function (m) {
        vframe[m.replace(/\.js$/, '')] = require('./middleware/' + m);
    });
