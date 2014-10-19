module.exports = function(vframe) {
    
    // NOTE(bajtos) we must use static require() due to browserify limitations
    vframe.Email = createModel(
        require('../common/models/email.json'),
        require('../common/models/email.js'));
    
    
    vframe.Application = createModel(
        require('../common/models/application.json'),
        require('../common/models/application.js'));
    
    
    vframe.AccessToken = createModel(
        require('../common/models/access-token.json'),
        require('../common/models/access-token.js'));
    
    
    vframe.RoleMapping = createModel(
        require('../common/models/role-mapping.json'),
        require('../common/models/role-mapping.js'));
    
    
    vframe.Role = createModel(
        require('../common/models/role.json'),
        require('../common/models/role.js'));
    
    
    vframe.ACL = createModel(
        require('../common/models/acl.json'),
        require('../common/models/acl.js'));
    
    
    vframe.Scope = createModel(
        require('../common/models/scope.json'),
        require('../common/models/scope.js'));
    
    
    vframe.User = createModel(
        require('../common/models/user.json'),
        require('../common/models/user.js'));
    
    
    vframe.Change = createModel(
        require('../common/models/change.json'),
        require('../common/models/change.js'));
    
    
    vframe.Checkpoint = createModel(
        require('../common/models/checkpoint.json'),
        require('../common/models/checkpoint.js'));
    
    
    
    /*!
     * Automatically attach these models to dataSources
     */
    var dataSourceTypes = {
        DB: 'db',
        MAIL: 'mail'
    };
    
    vframe.Email.autoAttach = dataSourceTypes.MAIL;
    vframe.PersistedModel.autoAttach = dataSourceTypes.DB;
    vframe.User.autoAttach = dataSourceTypes.DB;
    vframe.AccessToken.autoAttach = dataSourceTypes.DB;
    vframe.Role.autoAttach = dataSourceTypes.DB;
    vframe.RoleMapping.autoAttach = dataSourceTypes.DB;
    vframe.ACL.autoAttach = dataSourceTypes.DB;
    vframe.Scope.autoAttach = dataSourceTypes.DB;
    vframe.Application.autoAttach = dataSourceTypes.DB;
    
    function createModel(definitionJson, customizeFn) {
        var Model = vframe.createModel(definitionJson);
        customizeFn(Model);
        return Model;
    }
};
