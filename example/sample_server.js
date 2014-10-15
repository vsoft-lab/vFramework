
var vFrameApp = require('../');

var app = vFrameApp();

app.use(vFrameApp.favicon());

app.get('/', vFrameApp.status());

app.use(vFrameApp.urlNotFound());

app.start = function() {
    return app.listen(8008, function() {
        app.emit('started');
        console.log('Server was running at port 8008');
    });
};


if(require.main === module) {
    app.start();
}
