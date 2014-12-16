/*!
 * Module Dependencies.
 */
var Model = require('./model'),
    registry = require('./registry'),
    runtime = require('./runtime'),
    assert = require('assert'),
    async = require('async');

/**
 * Mở rộng Model với các query cơ bản và hỗ trợ CRUD.
 *
 * **Change Event**
 *
 * Lắng nghe khi thay đổi một model sử dụng event `change`.
 *
 * ```js
 * MyPersistedModel.on('changed', function(obj) {
 * console.log(obj) // => the changed model
 * });
 * ```
 *
 * @class PersistedModel
 */
var PersistedModel = module.exports = Model.extend('PersistedModel');
/*!
 * Setup the `PersistedModel` constructor.
 */
PersistedModel.setup = function setupPersistedModel() {
    // call Model.setup first
    Model.setup.call(this);
    var PersistedModel = this;
    // enable change tracking (usually for replication)
    if(this.settings.trackChanges) {
        PersistedModel._defineChangeModel();
        PersistedModel.once('dataSourceAttached', function() {
            PersistedModel.enableChangeTracking();
        });
    }
    PersistedModel.setupRemoting();
};
/*!
 * Throw an error telling the user that the method is not available and why.
 */
function throwNotAttached(modelName, methodName) {
    throw new Error(
        'Cannot call ' + modelName + '.'+ methodName + '().'
            + ' The ' + methodName + ' method has not been setup.'
            + ' The PersistedModel has not been correctly attached to a DataSource!'
    );
}

/*!
 * Chuyển null callback thành đối tượng 404.
 * @param {HttpContext} ctx
 * @param {Function} cb
 */
function convertNullToNotFoundError(ctx, cb) {
    if (ctx.result !== null) return cb();
    var modelName = ctx.method.sharedClass.name;
    var id = ctx.getArgByName('id');
    var msg = 'Unknown "' + modelName + '" id "' + id + '".';
    var error = new Error(msg);
    error.statusCode = error.status = 404;
    cb(error);
};


/**
 * Tạo một thể hiện(instance) mới của lớp Model, lưu trữ vào cơ sở dữ liệu.
 *
 * @param {Object} data Dữ liệu là một đối tượng tùy chọn.
 * @param {Function} cb Một function callback với cấu trúc `cb(err, obj)`,
 * Trong đó `err` là một đối tượng lỗi (error), còn `obj` có thể là null hoặc một thể hiện của model.
 */
PersistedModel.create = function (data, callback) {
    throwNotAttached(this.modelName, 'create');
};


/**
 * Cập nhật và thêm mới một thể hiện (instance) model.
 * @param {Object} data Dữ liệu của model instance.
 * @param {Function} [callback] Một function callback.
 */
PersistedModel.upsert = PersistedModel.updateOrCreate = function upsert(data, callback) {
    throwNotAttached(this.modelName, 'upsert');
};


/**
 * Tìm một bản ghi (record), giống `find`, nhưng giới hạn chỉ một đối tượng. Trả về một đối tượng, không phải một collection. 
 * Nếu không tìm thấy, tạo một đối tượng sử dụng dữ liệu được cung cấp như là tham số thứ 2.
 *
 * @param {Object} query Các điều kiện tìm kiếm: {where: {test: 'me'}}.
 * @param {Object} data Đối tượng được tạo.
 * @param {Function} cb Function callback sẽ gọi theo cấu trúc `cb(err, instance)`.
 */
PersistedModel.findOrCreate = function findOrCreate(query, data, callback) {
    throwNotAttached(this.modelName, 'findOrCreate');
};
PersistedModel.findOrCreate._delegate = true;


/**
 * Kiểm tra xem một thể hiện của model có tồn tại trong cơ sở dữ liệu.
 *
 * @param {id} id Định danh của đối tượng (giá trị id)
 * @param {Function} cb Một function callback sẽ được gọi theo (err, exists: Bool)
 */
PersistedModel.exists = function exists(id, cb) {
    throwNotAttached(this.modelName, 'exists');
};


/**
 * Tìm một đối tượng bởi ID.
 *
 * @param {*} id - primary key value
 * @param {Function} cb Một function callback sẽ được gọi theo `(err, returned-instance)`. Bắt buộc phải có.
 */
PersistedModel.findById = function find(id, cb) {
    throwNotAttached(this.modelName, 'findById');
};


/**
 * Tìm tất cả thể hiện của model mà giống với đặc tả `filter`.
 * Xem [Querying models](http://docs.strongloop.com/display/LB/Querying+models).
 *
 * @options {Object} [filter] Optional Filter JSON object; see below.
 * @property {String|Object|Array} fields Identify fields to include in return result.
 * <br/>See [Fields filter](http://docs.strongloop.com/display/LB/Fields+filter).
 * @property {String|Object|Array} include See PersistedModel.include documentation.
 * <br/>See [Include filter](http://docs.strongloop.com/display/LB/Include+filter).
 * @property {Number} limit Maximum number of instances to return.
 * <br/>See [Limit filter](http://docs.strongloop.com/display/LB/Limit+filter).
 * @property {String} order Sort order: either "ASC" for ascending or "DESC" for descending.
 * <br/>See [Order filter](http://docs.strongloop.com/display/LB/Order+filter).
 * @property {Number} skip Number of results to skip.
 * <br/>See [Skip filter](http://docs.strongloop.com/display/LB/Skip+filter).
 * @property {Object} where Where clause, like
 * ```
 * { key: val, key2: {gt: 'val2'}, ...}
 * ```
 * <br/>See [Where filter](http://docs.strongloop.com/display/LB/Where+filter).
 *
 * @param {Function} Callback function called with `(err, returned-instances)`.
 * @returns {Object} Array of model instances that match the filter; or Error.
 */
PersistedModel.find = function find(params, cb) {
    throwNotAttached(this.modelName, 'find');
};


/**
 * Tìm một thể hiện (instance) của model mà giống với `filter`.
 * Giống như `find`, nhưng giới hạn chỉ một kết quả;
 * Trả về một Object, không phải một collection.
 *
 * @options {Object} [filter] Optional Filter JSON object; see below.
 * @property {String|Object|Array} fields Identify fields to include in return result.
 * <br/>See [Fields filter](http://docs.strongloop.com/display/LB/Fields+filter).
 * @property {String|Object|Array} include See PersistedModel.include documentation.
 * <br/>See [Include filter](http://docs.strongloop.com/display/LB/Include+filter).
 * @property {Number} limit Maximum number of instances to return.
 * <br/>See [Limit filter](http://docs.strongloop.com/display/LB/Limit+filter).
 * @property {String} order Sort order: either "ASC" for ascending or "DESC" for descending.
 * <br/>See [Order filter](http://docs.strongloop.com/display/LB/Order+filter).
 * @property {Number} skip Number of results to skip.
 * <br/>See [Skip filter](http://docs.strongloop.com/display/LB/Skip+filter).
 * @property {Object} where Where clause, like
 * ```
 * { key: val, key2: {gt: 'val2'}, ...}
 * ```
 * <br/>See [Where filter](http://docs.strongloop.com/display/LB/Where+filter).
 *
 * @param {Function} Callback function called with `(err, returned-instance)`. Required.
 * @returns {Object} First model instance that matches the filter; or Error.
 */
PersistedModel.findOne = function findOne(params, cb) {
    throwNotAttached(this.modelName, 'findOne');
};


/**
 * Xóa toàn bộ thể hiện model giống với đặc tả `filter`.
 *
 * @options {Object} [where] Optional where filter JSON object; see below.
 * @property {Object} where Where clause, like
 * ```
 * { key: val, key2: {gt: 'val2'}, ...}
 * ```
 *
 * @param {Function} [cb] - Function callback sẽ được gọi với một tham số `(err)`.
 */
PersistedModel.destroyAll = function destroyAll(where, cb) {
    throwNotAttached(this.modelName, 'destroyAll');
};


/**
 * Mapping đến `destroyAll`
 */
PersistedModel.remove = PersistedModel.destroyAll;


/**
 * Mapping đến `destroyAll`
 */
PersistedModel.deleteAll = PersistedModel.destroyAll;


/**
 * Cập nhật nhiều thể hiện mà giống với mệnh đề `where`.
 *
 * Ví dụ:
 *
 *```js
 * Employee.update({managerId: 'x001'}, {managerId: 'x002'}, function(err) {
 * ...
 * });
 * ```
 *
 * @options {Object} [where] Optional where filter JSON object; see below.
 * @property {Object} where Where clause, like
 * ```
 * { key: val, key2: {gt: 'val2'}, ...}
 * ```
 * @param {Object} data Changes to be made
 * @param {Function} cb Callback function called with (err, count).
 */
PersistedModel.updateAll = function updateAll(where, data, cb) {
    throwNotAttached(this.modelName, 'updateAll');
};


PersistedModel.update = PersistedModel.updateAll;


/**
 * Xóa thể hiện model(model instance) với id xác định.
 * 
 * 
 * @param {*} id Giá trị ID của model instance sẽ được xóa.
 * @param {Function} cb Function callback sẽ được gọi với một tham số (err).
 */
PersistedModel.destroyById = function deleteById(id, cb) {
    throwNotAttached(this.modelName, 'deleteById');
};


/**
 * Mapping đến destroyById.
 */
PersistedModel.removeById = PersistedModel.destroyById;


/**
* Mapping đến destroyById.
 */
PersistedModel.deleteById = PersistedModel.destroyById;


/**
 * Return the number of records that match the optional filter.
 * @options {Object} [filter] Optional where filter JSON object; see below.
 * @property {Object} where Where clause, like
 * ```
 * { key: val, key2: {gt: 'val2'}, ...}
 * ```
 * @param {Function} cb Callback function called with (err, count).
 */
PersistedModel.count = function (where, cb) {
    throwNotAttached(this.modelName, 'count');
};


/**
 * Lưu một thể hiện(instance) của model. Nếu thể hiện không tồn tại một ID, phương thức [create](#persistedmodelcreatedata-cb) sẽ được tạo.
 *
 * Triggers: validate, save, update, or create.
 * @options {Object} [options] See below.
 * @property {Boolean} validate
 * @property {Boolean} throws
 * @param {Function} callback Function callback sẽ được gọi với hai tham số (err, obj).
 */
PersistedModel.prototype.save = function (options, callback) {
    var Model = this.constructor;
    if (typeof options == 'function') {
        callback = options;
        options = {};
    }
    callback = callback || function () {
    };
    options = options || {};
    if (!('validate' in options)) {
        options.validate = true;
    }
    if (!('throws' in options)) {
        options.throws = false;
    }
    var inst = this;
    var data = inst.toObject(true);
    var id = this.getId();
    if (!id) {
        return Model.create(this, callback);
    }
    // validate first
    if (!options.validate) {
        return save();
    }
    inst.isValid(function (valid) {
        if (valid) {
            save();
        } else {
            var err = new Model.ValidationError(inst);
            // throws option is dangerous for async usage
            if (options.throws) {
                throw err;
            }
            callback(err, inst);
        }
    });
    // then save
    function save() {
        inst.trigger('save', function (saveDone) {
            inst.trigger('update', function (updateDone) {
                Model.upsert(inst, function(err) {
                    inst._initProperties(data);
                    updateDone.call(inst, function () {
                        saveDone.call(inst, function () {
                            callback(err, inst);
                        });
                    });
                });
            }, data);
        }, data);
    }
};


/**
 * Xác định nếu các dữ liệu model là mới.
 * @returns {Boolean} Trả về true nếu dữ liệu của model là mới; nếu không sẽ trả về false.
 */
PersistedModel.prototype.isNewRecord = function () {
    throwNotAttached(this.constructor.modelName, 'isNewRecord');
};


/**
 * Xóa model từ persistence.
 * 
 * Triggers `destroy` hook (async) before and after destroying object.
 * @param {Function} callback Callback function.
 */
PersistedModel.prototype.destroy = function (cb) {
    throwNotAttached(this.constructor.modelName, 'destroy');
};


/**
 * Mapping đến destroy.
 * @header PersistedModel.remove
 */
PersistedModel.prototype.remove = PersistedModel.prototype.destroy;


/**
 * Mapping đến destroy.
 * @header PersistedModel.delete
 */
PersistedModel.prototype.delete = PersistedModel.prototype.destroy;
PersistedModel.prototype.destroy._delegate = true;


/**
 * Cập nhật một thuộc tính đơn.
 * Tương đương với `updateAttributes({name: 'value'}, cb)`
 *
 * @param {String} name Name of property
 * @param {Mixed} value Value of property
 * @param {Function} callback Callback function called with (err, instance).
 */
PersistedModel.prototype.updateAttribute = function updateAttribute(name, value, callback) {
    throwNotAttached(this.constructor.modelName, 'updateAttribute');
};


/**
 * Cập nhật một tập hợp các thuộc tính. Thực hiện việc xác nhận trước khi cập nhật.
 *
 * Trigger: `validation`, `save` and `update` hooks
 * @param {Object} data Dữ liệu sẽ được cập nhật.
 * @param {Function} callback Function callback sẽ được gọi theo (err, instance).
 */
PersistedModel.prototype.updateAttributes = function updateAttributes(data, cb) {
    throwNotAttached(this.modelName, 'updateAttributes');
};


/**
 * Nạp lại đối tượng từ persistence. Yêu cầu `id` của đối tượng `object` để có thể gọi `find`.
 * @param {Function} callback Callback function called with (err, instance) arguments.
 */
PersistedModel.prototype.reload = function reload(callback) {
    throwNotAttached(this.constructor.modelName, 'reload');
};


/**
 * Set the correct `id` property for the `PersistedModel`. If a `Connector` defines
 * a `setId` method it will be used. Otherwise the default lookup is used.
 * Override this method to handle complex IDs.
 *
 * @param {*} val The `id` value. Will be converted to the type that the `id` property specifies.
 */
PersistedModel.prototype.setId = function(val) {
    var ds = this.getDataSource();
    this[this.getIdName()] = val;
};


/**
 * Lấy giá trị `id` cho `PersistedModel`.
 *
 * @returns {*} Giá trị `id`.
 */
PersistedModel.prototype.getId = function() {
    var data = this.toObject();
    if(!data) return;
    return data[this.getIdName()];
};


/**
 * Lấy tên thuộc tính id của hàm tạo `constructor`.
 *
 * @returns {String} The `id` property name
 */
PersistedModel.prototype.getIdName = function() {
    return this.constructor.getIdName();
};


/**
 * Lấy tên thuộc tính id của hàm tạo `constructor`.
 * @returns {String} The `id` property name
 */
PersistedModel.getIdName = function() {
    var Model = this;
    var ds = Model.getDataSource();
    if(ds.idName) {
        return ds.idName(Model.modelName);
    } else {
        return 'id';
    }
};


PersistedModel.setupRemoting = function() {
    var PersistedModel = this;
    var typeName = PersistedModel.modelName;
    var options = PersistedModel.settings;
    function setRemoting(scope, name, options) {
        var fn = scope[name];
        fn._delegate = true;
        options.isStatic = scope === PersistedModel;
        PersistedModel.remoteMethod(name, options);
    }
    setRemoting(PersistedModel, 'create', {
        description: 'Tạo một khởi tạo(instance) mới của một model và persis nó vào data source.',
        accepts: {arg: 'data', type: 'object', description: 'Model instance data', http: {source: 'body'}},
        returns: {arg: 'data', type: typeName, root: true},
        http: {verb: 'post', path: '/'}
    });
    setRemoting(PersistedModel, 'upsert', {
        aliases: ['updateOrCreate'],
        description: 'Cập nhật một model đã tồn tại hoặc thêm một khởi tạo mới vào data source.',
        accepts: {arg: 'data', type: 'object', description: 'Model instance data', http: {source: 'body'}},
        returns: {arg: 'data', type: typeName, root: true},
        http: {verb: 'put', path: '/'}
    });
    setRemoting(PersistedModel, 'exists', {
        description: 'Kiểm tra xem một thể hiện của model có tồn tại hay không.',
        accepts: {arg: 'id', type: 'any', description: 'Model id', required: true},
        returns: {arg: 'exists', type: 'boolean'},
        http: [
            {verb: 'get', path: '/:id/exists'},
            {verb: 'head', path: '/:id'}
        ],
        rest: {
            // After hook to map exists to 200/404 for HEAD
            after: function(ctx, cb) {
                if (ctx.req.method === 'GET') {
                    // For GET, return {exists: true|false} as is
                    return cb();
                }
                if(!ctx.result.exists) {
                    var modelName = ctx.method.sharedClass.name;
                    var id = ctx.getArgByName('id');
                    var msg = 'Unknown "' + modelName + '" id "' + id + '".';
                    var error = new Error(msg);
                    error.statusCode = error.status = 404;
                    cb(error);
                } else {
                    cb();
                }
            }
        }
    });
    setRemoting(PersistedModel, 'findById', {
        description: 'Tìm một thể hiện của model theo id trong data source.',
        accepts: {
            arg: 'id', type: 'any', description: 'Model id', required: true,
            http: {source: 'path'}
        },
        returns: {arg: 'data', type: typeName, root: true},
        http: {verb: 'get', path: '/:id'},
        rest: {after: convertNullToNotFoundError}
    });
    setRemoting(PersistedModel, 'find', {
        description: 'Tìm tất cả các thể hiện của model giống theo filter  từ data source.',
        accepts: {arg: 'filter', type: 'object', description: 'Filter defining fields, where, orderBy, offset, and limit'},
        returns: {arg: 'data', type: [typeName], root: true},
        http: {verb: 'get', path: '/'}
    });
    setRemoting(PersistedModel, 'findOne', {
        description: 'Tìm thể hiện đầu tiên của model giống theo filter  từ data source.',
        accepts: {arg: 'filter', type: 'object', description: 'Filter defining fields, where, orderBy, offset, and limit'},
        returns: {arg: 'data', type: typeName, root: true},
        http: {verb: 'get', path: '/findOne'},
        rest: {after: convertNullToNotFoundError}
    });
    setRemoting(PersistedModel, 'destroyAll', {
        description: 'Xóa tất cả các bản ghi phù hợp.',
        accepts: {arg: 'where', type: 'object', description: 'filter.where object'},
        http: {verb: 'del', path: '/'},
        shared: false
    });
    setRemoting(PersistedModel, 'updateAll', {
        aliases: ['update'],
        description: 'Cập nhật thể hiện của một model phù hợp với where  từ data source.',
        accepts: [
            {arg: 'where', type: 'object', http: {source: 'query'},
             description: 'Criteria to match model instances'},
            {arg: 'data', type: 'object', http: {source: 'body'},
             description: 'An object of model property name/value pairs'},
        ],
        http: {verb: 'post', path: '/update'}
    });
    setRemoting(PersistedModel, 'deleteById', {
        aliases: ['destroyById', 'removeById'],
        description: 'Xóa một thể hiện của model theo id từ data source.',
        accepts: {arg: 'id', type: 'any', description: 'Model id', required: true,
                  http: {source: 'path'}},
        http: {verb: 'del', path: '/:id'}
    });
    setRemoting(PersistedModel, 'count', {
        description: 'Đếm các thể hiện của model phù hợp theo where từ data source.',
        accepts: {arg: 'where', type: 'object', description: 'Criteria to match model instances'},
        returns: {arg: 'count', type: 'number'},
        http: {verb: 'get', path: '/count'}
    });
    setRemoting(PersistedModel.prototype, 'updateAttributes', {
        description: 'Cập nhật những thuộc tính từ một thể hiện của model và persis nó vào trong data source.',
        accepts: {arg: 'data', type: 'object', http: {source: 'body'}, description: 'An object of model property name/value pairs'},
        returns: {arg: 'data', type: typeName, root: true},
        http: {verb: 'put', path: '/'}
    });
    if(options.trackChanges) {
        setRemoting(PersistedModel, 'diff', {
            description: 'Get a set of deltas and conflicts since the given checkpoint',
            accepts: [
                {arg: 'since', type: 'number', description: 'Find deltas since this checkpoint'},
                {arg: 'remoteChanges', type: 'array', description: 'an array of change objects',
                 http: {source: 'body'}}
            ],
            returns: {arg: 'result', type: 'object', root: true},
            http: {verb: 'post', path: '/diff'}
        });
        setRemoting(PersistedModel, 'changes', {
            description: 'Get the changes to a model since a given checkpoint.'
                + 'Provide a filter object to reduce the number of results returned.',
            accepts: [
                {arg: 'since', type: 'number', description: 'Only return changes since this checkpoint'},
                {arg: 'filter', type: 'object', description: 'Only include changes that match this filter'}
            ],
            returns: {arg: 'changes', type: 'array', root: true},
            http: {verb: 'get', path: '/changes'}
        });
        setRemoting(PersistedModel, 'checkpoint', {
            description: 'Create a checkpoint.',
            returns: {arg: 'checkpoint', type: 'object', root: true},
            http: {verb: 'post', path: '/checkpoint'}
        });
        setRemoting(PersistedModel, 'currentCheckpoint', {
            description: 'Get the current checkpoint.',
            returns: {arg: 'checkpoint', type: 'object', root: true},
            http: {verb: 'get', path: '/checkpoint'}
        });
        setRemoting(PersistedModel, 'createUpdates', {
            description: 'Create an update list from a delta list',
            accepts: {arg: 'deltas', type: 'array', http: {source: 'body'}},
            returns: {arg: 'updates', type: 'array', root: true},
            http: {verb: 'post', path: '/create-updates'}
        });
        setRemoting(PersistedModel, 'bulkUpdate', {
            description: 'Run multiple updates at once. Note: this is not atomic.',
            accepts: {arg: 'updates', type: 'array'},
            http: {verb: 'post', path: '/bulk-update'}
        });
        setRemoting(PersistedModel, 'rectifyAllChanges', {
            description: 'Rectify all Model changes.',
            http: {verb: 'post', path: '/rectify-all'}
        });
        setRemoting(PersistedModel, 'rectifyChange', {
            description: 'Tell vframe that a change to the model with the given id has occurred.',
            accepts: {arg: 'id', type: 'any', http: {source: 'path'}},
            http: {verb: 'post', path: '/:id/rectify-change'}
        });
    }
};


/**
 * Get a set of deltas and conflicts since the given checkpoint.
 *
 * See `Change.diff()` for details.
 *
 * @param {Number} since Find deltas since this checkpoint
 * @param {Array} remoteChanges An array of change objects
 * @param {Function} callback
 */
PersistedModel.diff = function(since, remoteChanges, callback) {
    var Change = this.getChangeModel();
    Change.diff(this.modelName, since, remoteChanges, callback);
};


/**
 * Get the changes to a model since a given checkpoint. Provide a filter object
 * to reduce the number of results returned.
 * @param {Number} since Only return changes since this checkpoint
 * @param {Object} filter Only include changes that match this filter
 * (same as `Model.find(filter, ...)`)
 * @callback {Function} callback
 * @param {Error} err
 * @param {Array} changes An array of `Change` objects
 * @end
 */
PersistedModel.changes = function(since, filter, callback) {
    if(typeof since === 'function') {
        filter = {};
        callback = since;
        since = -1;
    }
    if(typeof filter === 'function') {
        callback = filter;
        since = -1;
        filter = {};
    }
    var idName = this.dataSource.idName(this.modelName);
    var Change = this.getChangeModel();
    var model = this;
    filter = filter || {};
    filter.fields = {};
    filter.where = filter.where || {};
    filter.fields[idName] = true;
    // TODO(ritch) this whole thing could be optimized a bit more
    Change.find({
        checkpoint: {gt: since},
        modelName: this.modelName
    }, function(err, changes) {
        if(err) return callback(err);
        var ids = changes.map(function(change) {
            return change.getModelId();
        });
        filter.where[idName] = {inq: ids};
        model.find(filter, function(err, models) {
            if(err) return callback(err);
            var modelIds = models.map(function(m) {
                return m[idName].toString();
            });
            callback(null, changes.filter(function(ch) {
                if(ch.type() === Change.DELETE) return true;
                return modelIds.indexOf(ch.modelId) > -1;
            }));
        });
    });
};


/**
 * Tạo một checkpoint.
 *
 * @param {Function} callback
 */
PersistedModel.checkpoint = function(cb) {
    var Checkpoint = this.getChangeModel().getCheckpointModel();
    this.getSourceId(function(err, sourceId) {
        if(err) return cb(err);
        Checkpoint.create({
            sourceId: sourceId
        }, cb);
    });
};


/**
 * Lấy id của checkpoint hiện tại.
 *
 * @callback {Function} callback
 * @param {Error} err
 * @param {Number} currentCheckpointId
 * @end
 */
PersistedModel.currentCheckpoint = function(cb) {
    var Checkpoint = this.getChangeModel().getCheckpointModel();
    Checkpoint.current(cb);
};


/**
 * Replicate changes since the given checkpoint to the given target model.
 *
 * @param {Number} [since] Since this checkpoint
 * @param {Model} targetModel Target this model class
 * @param {Object} [options]
 * @param {Object} [options.filter] Replicate models that match this filter
 * @callback {Function} [callback]
 * @param {Error} err
 * @param {Conflict[]} conflicts A list of changes that could not be replicated
 * due to conflicts.
 */
PersistedModel.replicate = function(since, targetModel, options, callback) {
    var lastArg = arguments[arguments.length - 1];
    if(typeof lastArg === 'function' && arguments.length > 1) {
        callback = lastArg;
    }
    if(typeof since === 'function' && since.modelName) {
        targetModel = since;
        since = -1;
    }
    options = options || {};
    var sourceModel = this;
    var diff;
    var updates;
    var Change = this.getChangeModel();
    var TargetChange = targetModel.getChangeModel();
    var changeTrackingEnabled = Change && TargetChange;
    assert(
        changeTrackingEnabled,
        'You must enable change tracking before replicating'
    );
    callback = callback || function defaultReplicationCallback(err) {
        if(err) throw err;
    };
    
    var tasks = [
        getSourceChanges,
        getDiffFromTarget,
        createSourceUpdates,
        bulkUpdate,
        checkpoint
    ];
    async.waterfall(tasks, done);
    function getSourceChanges(cb) {
        sourceModel.changes(since, options.filter, cb);
    }
    function getDiffFromTarget(sourceChanges, cb) {
        targetModel.diff(since, sourceChanges, cb);
    }
    function createSourceUpdates(_diff, cb) {
        diff = _diff;
        diff.conflicts = diff.conflicts || [];
        if(diff && diff.deltas && diff.deltas.length) {
            sourceModel.createUpdates(diff.deltas, cb);
        } else {
            // nothing to replicate
            done();
        }
    }
    function bulkUpdate(updates, cb) {
        targetModel.bulkUpdate(updates, cb);
    }
    function checkpoint() {
        var cb = arguments[arguments.length - 1];
        sourceModel.checkpoint(cb);
    }
    function done(err) {
        if(err) return callback(err);
        var conflicts = diff.conflicts.map(function(change) {
            return new Change.Conflict(
                change.modelId, sourceModel, targetModel
            );
        });
        if(conflicts.length) {
            sourceModel.emit('conflicts', conflicts);
        }
        callback && callback(null, conflicts);
    }
};


/**
 * Create an update list (for `Model.bulkUpdate()`) from a delta list
 * (result of `Change.diff()`).
 *
 * @param {Array} deltas
 * @param {Function} callback
 */
PersistedModel.createUpdates = function(deltas, cb) {
    var Change = this.getChangeModel();
    var updates = [];
    var Model = this;
    var tasks = [];
    deltas.forEach(function(change) {
        var change = new Change(change);
        var type = change.type();
        var update = {type: type, change: change};
        switch(type) {
        case Change.CREATE:
        case Change.UPDATE:
            tasks.push(function(cb) {
                Model.findById(change.modelId, function(err, inst) {
                    if(err) return cb(err);
                    if(!inst) {
                        console.error('missing data for change:', change);
                        return cb && cb(new Error('missing data for change: '
                                                  + change.modelId));
                    }
                    if(inst.toObject) {
                        update.data = inst.toObject();
                    } else {
                        update.data = inst;
                    }
                    updates.push(update);
                    cb();
                });
            });
            break;
        case Change.DELETE:
            updates.push(update);
            break;
        }
    });
    async.parallel(tasks, function(err) {
        if(err) return cb(err);
        cb(null, updates);
    });
};


/**
 * Apply an update list.
 *
 * **Note: this is not atomic**
 *
 * @param {Array} updates An updates list (usually from Model.createUpdates())
 * @param {Function} callback
 */
PersistedModel.bulkUpdate = function(updates, callback) {
    var tasks = [];
    var Model = this;
    var idName = this.dataSource.idName(this.modelName);
    var Change = this.getChangeModel();
    updates.forEach(function(update) {
        switch(update.type) {
        case Change.UPDATE:
        case Change.CREATE:
            // var model = new Model(update.data);
            // tasks.push(model.save.bind(model));
            tasks.push(function(cb) {
                var model = new Model(update.data);
                model.save(cb);
            });
            break;
        case Change.DELETE:
            var data = {};
            data[idName] = update.change.modelId;
            var model = new Model(data);
            tasks.push(model.destroy.bind(model));
            break;
        }
    });
    async.parallel(tasks, callback);
};


/**
 * Get the `Change` model.
 *
 * @throws {Error} Throws an error if the change model is not correctly setup.
 * @return {Change}
 */
PersistedModel.getChangeModel = function() {
    var changeModel = this.Change;
    var isSetup = changeModel && changeModel.dataSource;
    assert(isSetup, 'Cannot get a setup Change model');
    return changeModel;
};


/**
 * Get the source identifier for this model / dataSource.
 *
 * @callback {Function} callback
 * @param {Error} err
 * @param {String} sourceId
 */
PersistedModel.getSourceId = function(cb) {
    var dataSource = this.dataSource;
    if(!dataSource) {
        this.once('dataSourceAttached', this.getSourceId.bind(this, cb));
    }
    assert(
        dataSource.connector.name,
        'Model.getSourceId: cannot get id without dataSource.connector.name'
    );
    var id = [dataSource.connector.name, this.modelName].join('-');
    cb(null, id);
};


/**
 * Enable the tracking of changes made to the model. Usually for replication.
 */
PersistedModel.enableChangeTracking = function() {
    var Model = this;
    var Change = this.Change || this._defineChangeModel();
    var cleanupInterval = Model.settings.changeCleanupInterval || 30000;
    assert(this.dataSource, 'Cannot enableChangeTracking(): ' + this.modelName
           + ' is not attached to a dataSource');
    Change.attachTo(this.dataSource);
    Change.getCheckpointModel().attachTo(this.dataSource);
    Model.afterSave = function afterSave(next) {
        Model.rectifyChange(this.getId(), next);
    };
    Model.afterDestroy = function afterDestroy(next) {
        Model.rectifyChange(this.getId(), next);
    };
    Model.on('deletedAll', cleanup);
    if(runtime.isServer) {
        // initial cleanup
        cleanup();
        // cleanup
        setInterval(cleanup, cleanupInterval);
        function cleanup() {
            Model.rectifyAllChanges(function(err) {
                if(err) {
                    console.error(Model.modelName + ' Change Cleanup Error:');
                    console.error(err);
                }
            });
        }
    }
};


PersistedModel._defineChangeModel = function() {
    var BaseChangeModel = registry.getModel('Change');
    assert(BaseChangeModel,
           'Change model must be defined before enabling change replication');
    return this.Change = BaseChangeModel.extend(this.modelName + '-change',
                                                {},
                                                {
                                                    trackModel: this
                                                }
                                               );
};


PersistedModel.rectifyAllChanges = function(callback) {
    this.getChangeModel().rectifyAll(callback);
};


/**
 * Handle a change error. Override this method in a subclassing model to customize
 * change error handling.
 *
 * @param {Error} err
 */
PersistedModel.handleChangeError = function(err) {
    if(err) {
        console.error(Model.modelName + ' Change Tracking Error:');
        console.error(err);
    }
};


/**
 * Tell vframe that a change to the model with the given id has occurred.
 *
 * @param {*} id The id of the model that has changed
 * @callback {Function} callback
 * @param {Error} err
 */
PersistedModel.rectifyChange = function(id, callback) {
    var Change = this.getChangeModel();
    Change.rectifyModelChanges(this.modelName, [id], callback);
};


PersistedModel.setup();

