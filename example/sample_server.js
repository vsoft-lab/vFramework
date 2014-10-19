
var vFrameApp = require('../');
var boot = require('vsoft-boot');

var app = vFrameApp();


app.use(vFrameApp.favicon());


boot(app, __dirname);


// console.log(vFrameApp.errorHandler.title);

// app.enableAuth();

// app.get('/', vFrameApp.status());


// app.use('/api', vFrameApp.rest());


// console.log(app);

// app.use(vFrameApp.token({
//     cookies: ['foo-auth'],
//     headers: ['foo-auth', 'X-Foo-Auth'],
//     params: ['foo-auth', 'foo_auth']
// }));






// console.log(vFrameApp.isServer);




// console.log(app.dataSources);

// app.connector('mongodb', require('vsoft-connector-mongodb'));

// console.log(app.connectors);

// console.log(app.remoteObjects());



// Instance JSON document
var user = {
    name: 'ThinhNguyen',
    age: 27,
    birthday: new Date(),
    vip: true,
    address: {
        street: 'Bac Giang City',
        city: 'BG',
        state: 'HN',
        zipcode: '10000',
        country: 'VN'
    },
    friends: ['Nga', 'Tung'],
    emails: [
        {label: 'work', id: 'x@sample.com'},
        {label: 'home', id: 'x@home.com'}
    ],
    tags: []
};

var ds = vFrameApp.createDataSource({
    connector: require('vsoft-connector-mongodb'),
    host: 'localhost',
    port: 27017,
    database: 'vFrameServer'
});

var User = ds.buildModelFromInstance('User', user, {idInjection: true});


// var accessToken = new vFrameApp.AccessToken();

// // Create token
// vFrameApp.AccessToken.createAccessTokenId(function(err, token) {
//     // console.log(token);
// });





// var obj = new User(user);
  
// console.log(obj.toObject());


// User.create(user, function (err, u1) {
//     console.log('Created: ', u1.toObject());
//     User.findById(u1.id, function (err, u2) {
//         console.log('Found: ', u2.toObject());
//     });
// });

app.model(User);




// Strong remoting ...
// console.log(vFrameApp.Remote);
// var rm = require('strong-remoting').create();
// console.log(rm.classes());


// vFrameApp.findModel('User');
// var models = app.models();

// models.forEach(function (Model) {
//  console.log(Model.modelName); // color
// });



app.use(vFrameApp.urlNotFound());

app.start = function() {
    return app.listen(function() {
        app.emit('started');
        console.log('Server was running at %s', app.get('url'));
    });
};


// console.log(vFrameApp.Mail.mailer);
// console.log(vFrameApp.version);

if(require.main === module) {
    app.start();
}




// var loopback = require('loopback');
// var app = loopback();

// console.log(app.connector);

// app.get('/', function(req, res){
//     res.send('hello world');
// });

// app.listen(3000);
