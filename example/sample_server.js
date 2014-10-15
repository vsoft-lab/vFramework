
var vFrameApp = require('../');

var app = vFrameApp();

app.get('/', vFrameApp.status());

app.listen(8008, function() {
    console.log('Server was running at port 8008');
});
