const Sorteadores = require("../controllers/sorteadoresController");
const validate = require("../validations/sorteadores");

const baseUri = function (uri) {
    if (uri) {
        return `/${uri}`;
    }
    return '/';
};

module.exports = function (application) {
    const sorteadoresController = new Sorteadores(application);

    application.get(baseUri(), function (req, res) {
        sorteadoresController.index(req, res);
    });

    // application.get(baseUri('createupdate'), (req, res) => sorteadoresController.createupdate(req, res));
    // application.post(baseUri('createupdate'), validate.createUpdate, (req, res) => sorteadoresController.createupdate(req, res));
    // application.put(baseUri('createupdate'), validate.createUpdate, (req, res) => sorteadoresController.createupdate(req, res));
    
    // application.delete(baseUri('delete'), validate.delete, (req, res) => sorteadoresController.delete(req, res));

    // application.get(baseUri('serverprocessing'), function (req, res) {
    //     sorteadoresController.serverProcessing(req, res);
    // });
};