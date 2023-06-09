const Premios = require("../controllers/premiosController");
const validate = require("../validations/premios");

const baseUri = function (uri) {
    if (uri) {
        return `/premios/${uri}`;
    }
    return '/premios';
};

module.exports = function (application) {
    const premiosController = new Premios();

    application.get(baseUri(), function (req, res) {
        premiosController.index(req, res);
    });

    application.get(baseUri('createupdate'), (req, res) => premiosController.createupdate(req, res));
    application.post(baseUri('createupdate'), validate.createupdate, (req, res) => premiosController.createupdate(req, res));
    application.put(baseUri('createupdate'), validate.createupdate, (req, res) => premiosController.createupdate(req, res));

    application.delete(baseUri('delete'), validate.delete, (req, res) => premiosController.delete(req, res));

    application.get(baseUri('serverprocessing'), function (req, res) {
        premiosController.serverProcessing(req, res);
    });
};