module.exports = function (server) {
    var router = server.vframe.Router();
    router.get('/', server.vframe.status());
    server.use(router);
};
