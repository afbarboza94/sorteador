var fixedDataPage = {};

module.exports = {
    fixedDataPage,
    template: (res, path, data) =>
        res.render("templates", { content: `../${path}`, data: { ...data, ...fixedDataPage } })
};