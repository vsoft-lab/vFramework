
var vFrameApp = require('../');

//console.log(vFrameApp);


var app = vFrameApp();

app.get('/', vFrameApp.status());

app.listen(8008, function() {
    
});
