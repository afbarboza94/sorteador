module.exports = class Sorteadores {
    constructor(application) {
        this.application = application;
    }
    
    index = (req, res) => {
        require("../helpers").template(this.application, res, "categorias/index", {});
    }
}