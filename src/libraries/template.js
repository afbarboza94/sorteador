module.exports = {
    template: (res, path, data) =>
        res.render("templates", { content: `../${path}`, data: { ...data } })
};