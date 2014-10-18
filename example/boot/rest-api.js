module.exports = function mountRestFull(server) {
    var restApiRoot = server.get('restApiRoot');
    server.use(restApiRoot, server.vframe.rest());
};
