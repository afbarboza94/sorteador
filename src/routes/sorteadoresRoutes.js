const Sorteadores = require("../controllers/sorteadoresController");
const validate = require("../validations/sorteadores");

const baseUri = function (uri) {
    if (uri) {
        return `/sorteios/${uri}`;
    }
    return '/sorteios';
};

module.exports = /**
* @var {{require('express')()}}
*/
    function (application) {
        const sorteadoresController = new Sorteadores();

        application.get('/', function (req, res) {
            sorteadoresController.index(req, res);
        });

        application.get(baseUri(''), (req, res) => sorteadoresController.sorteio(req, res));
        application.get(baseUri('createupdate'), (req, res) => sorteadoresController.createupdate(req, res));
        application.post(baseUri('createupdate'), validate.createUpdate, (req, res) => sorteadoresController.createupdate(req, res));
        application.put(baseUri('createupdate'), validate.createUpdate, (req, res) => sorteadoresController.createupdate(req, res));

        application.delete(baseUri('delete'), validate.delete, (req, res) => sorteadoresController.delete(req, res));

        application.get('/serverprocessing', function (req, res) {
            sorteadoresController.serverProcessing(req, res);
        });
    };