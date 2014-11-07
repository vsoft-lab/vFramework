
/*!
 * Module dependencies.
 */
var DataSource = require('vsoft-datasource-juggler').DataSource,
    registry = require('./registry'),
    assert = require('assert'),
    fs = require('fs'),
    extend = require('util')._extend,
    _ = require('underscore'),
    RemoteObjects = require('strong-remoting'),
    stringUtils = require('underscore.string'),
    path = require('path');

/**
 * Đối tượng `App` sẽ đại diện cho một ứng dụng vframe.
 *
 * Đối tượng `App` sẽ kế thừa từ [Express](http://expressjs.com/api.html) và 
 * hỗ trợ tất cả các Express middleware. Xem 
 * [Express documentation](http://expressjs.com/) để đọc chi tiết hơn.
 *
 * ```js
 * var vframe = require('vframe');
 * var app = vframe();
 *
 * app.get('/', function(req, res){
 * res.send('hello world');
 * });
 *
 * app.listen(3000);
 * ```
 *
 * @class VframeApplication
 * @header var app = vframe()
 */
function App() {
    // this is a dummy placeholder for jsdox
}


/*!
 * Export the app prototype.
 */
var app = exports = module.exports = {};


/**
 * Lazily load a set of [remote objects](http://apidocs.strongloop.com/strong-remoting/#remoteobjectsoptions).
 * Tải một tập hợp các [remote object](http://strong-remoting).
 *
 * **Chú ý:** Gọi phương thức `app.remote()` hơn một lần sẽ chỉ trả về một đối tượng remote object duy nhất.
 * @returns {RemoteObjects}
 */
app.remotes = function () {
    if(this._remotes) {
        return this._remotes;
    } else {
        var options = {};
        if(this.get) {
            options = this.get('remoting');
        }
        return (this._remotes = RemoteObjects.create(options));
    }
};


/*!
 * Remove a route by reference.
 */
app.disuse = function (route) {
    if(this.stack) {
        for (var i = 0; i < this.stack.length; i++) {
            if(this.stack[i].route === route) {
                this.stack.splice(i, 1);
            }
        }
    }
};



/**
 * Gắn (Attach) một model vào đối tượng app. Tất cả các `Model` sẽ có sẵn trong 
 * đối tượng `app.models()`
 *
 * Ví dụ - Gắn (Attach) một model đã tồn tại:
 ```js
 * var User = vframe.User;
 * app.model(User);
 *```
 * 
 * Ví dụ - Đính kèm một model hiện có, thay đổi một số thuộc tính của model:
 * ```js
 * var User = vframe.User;
 * app.model(User, { dataSource: 'db' });
 *```
 *
 * @param {Object|String} Model Model sẽ được attach.
 * @options {Object} config Cấu hình của model.
 * @property {String|DataSource} dataSource `DataSource` để attach các model.
 * @property {Boolean} [public] Model bất kì sẽ được hiển thị thông qua REST API.
 * @property {Object} [relations] Thêm/cập nhật các quan hệ.
 * @end
 * @returns {ModelConstructor} Lớp model.
 */
app.model = function (Model, config) {

    var isPublic = true;

    if (arguments.length > 1) {
        config = config || {};
        if (typeof Model === 'string') {
            // create & attach the model - backwards compatibility
            // create config for loopback.modelFromConfig
            var modelConfig = extend({}, config);
            modelConfig.options = extend({}, config.options);
            modelConfig.name = Model;

            // modeller does not understand `dataSource` option
            delete modelConfig.dataSource;
            Model = registry.createModel(modelConfig);

            // delete config options already applied
            ['relations', 'base', 'acls', 'hidden'].forEach(function(prop) {
                delete config[prop];
                if (config.options) delete config.options[prop];
            });
            delete config.properties;
        }
        configureModel(Model, config, this);
        isPublic = config.public !== false;
    } else {
        assert(Model.prototype instanceof registry.Model,
               Model.modelName + ' must be a descendant of loopback.Model');
    }
    var modelName = Model.modelName;
    this.models[modelName] =
        this.models[classify(modelName)] =
        this.models[camelize(modelName)] = Model;
    this.models().push(Model);
    if (isPublic && Model.sharedClass) {
        this.remotes().addClass(Model.sharedClass);
        if (Model.settings.trackChanges && Model.Change) {
            this.remotes().addClass(Model.Change.sharedClass);
        }
        clearHandlerCache(this);
        this.emit('modelRemoted', Model.sharedClass);
    }
    Model.shared = isPublic;
    Model.app = this;
    Model.emit('attached', this);
    return Model;
};



/**
 * Lấy các model sẽ được hiện thị bởi app. Chỉ trả về những model đã được định nghĩa bằng cách sử dụng `app.model()`
 *
 * Có 2 cách để truy cập các model:
 *
 * 1. Gọi `app.models()` để lấy một danh sách tất cả các models.
 *
 * ```js
 * var models = app.models();
 *
 * models.forEach(function (Model) {
 * console.log(Model.modelName); // color
 * });
 * ```
 *
 * 2. Sử dụng `app.model` để truy cập một model theo tên.
 * `app.model` có tất cả các thuộc tính đã được định nghĩa trong model.
 *
 * Ví dụ sau sẽ minh họa cho việc truy xuất model Product và CustomerReceipt.
 * Sử dụng đối tượng `models`
 *
 * ```js
 * var vf = require('vf');
 * var app = vf();
 * app.boot({
 * dataSources: {
 * db: {connector: 'memory'}
 * }
 * });
 *
 * app.model('product', {dataSource: 'db'});
 * app.model('customer-receipt', {dataSource: 'db'});
 *
 * // Sẽ có sẵn theo tên model
 * var Product = app.models.Product;
 *
 * // also available as camelCase
 * var product = app.models.product;
 *
 * // multi-word models are avaiable as pascal cased
 * var CustomerReceipt = app.models.CustomerReceipt;
 *
 * // also available as camelCase
 * var customerReceipt = app.models.customerReceipt;
 * ```
 *
 * @returns {Array} Array of model classes.
 */
app.models = function () {
    return this._models || (this._models = []);
};


/**
 * Định nghĩa một DataSource.
 *
 * @param {String} name The data source name
 * @param {Object} config The data source config
 */
app.dataSource = function (name, config) {
    var ds = dataSourcesFromConfig(config, this.connectors);
    this.dataSources[name] =
        this.dataSources[classify(name)] =
        this.dataSources[camelize(name)] = ds;
    return ds;
};


/**
 * Đăng ký một connector.
 *
 * Khi một data-source được thêm vào thông qua `app.datasource`, the connector
 * name is looked up in the registered connectors first.
 * 
 * Connectors are required to be explicitly registered only for applications
 * using browserify, because browserify does not support dynamic require,
 * which is used by LoopBack to automatically load the connector module.
 *
 * @param {String} name Name of the connector, e.g. 'mysql'.
 * @param {Object} connector Connector object as returned
 * by `require('loopback-connector-{name}')`.
 */
app.connector = function(name, connector) {
    this.connectors[name] =
        this.connectors[classify(name)] =
        this.connectors[camelize(name)] = connector;
};


/**
 * Lấy tất cả các đối tượng remote.
 * @returns {Object} [Remote objects](http://apidocs.strongloop.com/strong-remoting/#remoteobjectsoptions).
 */
app.remoteObjects = function () {
    var result = {};
    this.remotes().classes().forEach(function(sharedClass) {
        result[sharedClass.name] = sharedClass.ctor;
    });
    return result;
};


/*!
 * Get a handler of the specified type from the handler cache.
 * @triggers `mounted` events on shared class constructors (models)
 */
app.handler = function (type) {

    var handlers = this._handlers || (this._handlers = {});

    if(handlers[type]) {
        return handlers[type];
    }

    var remotes = this.remotes();
    var handler = this._handlers[type] = remotes.handler(type);

    remotes.classes().forEach(function(sharedClass) {
        sharedClass.ctor.emit('mounted', app, sharedClass, remotes);
    });

    return handler;
};



/**
 * Một đối tượng để lưu trữ các khởi tạo của dataSource.
 */
app.dataSources = app.datasources = {};




// /**
//  * Enable app wide authentication.
//  */
app.enableAuth = function() {
    var remotes = this.remotes();
    var app = this;
    remotes.before('**', function(ctx, next, method) {
        var req = ctx.req;
        var Model = method.ctor;
        var modelInstance = ctx.instance;
        var modelId = modelInstance && modelInstance.id || req.param('id');
        var modelSettings = Model.settings || {};
        var errStatusCode = modelSettings.aclErrorStatus || app.get('aclErrorStatus') || 401;
        if(!req.accessToken){
            errStatusCode = 401;
        }
        if(Model.checkAccess) {
            Model.checkAccess(
                req.accessToken,
                modelId,
                method,
                ctx,
                function(err, allowed) {
                    if(err) {
                        console.log(err);
                        next(err);
                    } else if(allowed) {
                        next();
                    } else {
                        var messages = {
                            403:'Access Denied',
                            404: ('could not find a model with id ' + modelId),
                            401:'Authorization Required'
                        };
                        var e = new Error(messages[errStatusCode] || messages[403]);
                        e.statusCode = errStatusCode;
                        next(e);
                    }
                }
            );
        } else {
            next();
        }
    });

    this.isAuthEnabled = true;
};

// app.boot = function(options) {
//     throw new Error(
//         '`app.boot` was removed, use the new module vsoft-boot instead');
// };



function classify(str) {
    return stringUtils.classify(str);
};
function camelize(str) {
    return stringUtils.camelize(str);
};


function dataSourcesFromConfig(config, connectorRegistry) {
    var connectorPath;

    assert(typeof config === 'object',
           'cannont create data source without config object');

    if(typeof config.connector === 'string') {
        var name = config.connector;

        if (connectorRegistry[name]) {
            config.connector = connectorRegistry[name];
        } else {
            connectorPath = path.join(__dirname, 'connectors', name + '.js');

            if (fs.existsSync(connectorPath)) {
                config.connector = require(connectorPath);
            }
        }
    }

    return registry.createDataSource(config);
}



function configureModel(ModelCtor, config, app) {
    assert(ModelCtor.prototype instanceof registry.Model,
           ModelCtor.modelName + ' must be a descendant of vframe.Model');

    var dataSource = config.dataSource;

    if(dataSource) {
        if(typeof dataSource === 'string') {
            dataSource = app.dataSources[dataSource];
        }
        assert(dataSource instanceof DataSource,
               ModelCtor.modelName + ' is referencing a dataSource that does not exist: "' +
               config.dataSource +'"');
    }

    config = extend({}, config);
    config.dataSource = dataSource;
    registry.configureModel(ModelCtor, config);
}


function clearHandlerCache(app) {
    app._handlers = undefined;
}


/**
 * Lắng nghe các kết nối và cập nhật cổng đã được cấu hình.
 * 
 * Khi không có tham số nào hoặc chỉ có một tham số là một callback function,  
 * Server sẽ lắng nghe trên `app.get('host')` và `app.get('port')`.
 *
 * Ví dụ, để lắng nghe trên host/port trong config app:
 * ```js
 * app.listen();
 * ```
 *
 * Nếu không thì tất cả các đối số sẽ được chuyển tiếp đến `http.Server.listen`.
 *
 * Ví dụ, để lắng nghe trên một port xác định và tất cả các host, bỏ qua config app.
 * ```js
 * app.listen(80);
 * ```
 *
 * The function also installs a `listening` callback that calls
 * `app.set('port')` with the value returned by `server.address().port`.
 * This way the port param contains always the real port number, even when
 * listen was called with port number 0.
 *
 * @param {Function} [cb] If specified, the callback is added as a listener
 * for the server's "listening" event.
 * @returns {http.Server} A node `http.Server` with this application configured
 * as the request handler.
 */
app.listen = function(cb) {
    var self = this;

    var server = require('http').createServer(this);

    server.on('listening', function() {
        self.set('port', this.address().port);

        if (!self.get('url')) {
            // A better default host would be `0.0.0.0`,
            // but such URL is not supported by Windows
            var host = self.get('host') || '127.0.0.1';
            var url = 'http://' + host + ':' + self.get('port') + '/';
            self.set('url', url);
        }
    });

    var useAppConfig =
            arguments.length == 0 ||
            (arguments.length == 1 && typeof arguments[0] == 'function');

    if (useAppConfig) {
        server.listen(this.get('port'), this.get('host'), cb);
    } else {
        server.listen.apply(server, arguments);
    }
    return server;
};
