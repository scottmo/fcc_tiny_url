"use strict";

module.exports = function(app, db) {
    const api = require("../lib/url-shortener.js")(db);

    app.route("/")
        .get(function(req, res) {
            res.render("index");
        });
    app.route("/new")
        .get(function(req, res) {
            res.send({
                "Error": "Please provide a proper url."
            });
        });
    app.route("/new/:url*")
        .get(function(req, res) {
            // strip first 5 chars of /new/
            // req.params.url doesn' work here
            const url = req.url.slice(5);
            if (api.isUrlValid(url)) {
                api.storeUrl(url, function(urlPair) {
                    res.send(urlPair);
                });
            } else {
                res.send({
                    "Error": "Invalid url supplied. Please provide a proper url."
                });
            }
        });
    app.route("/:id")
        .get(function(req, res) {
            const id = req.params.id;
            api.getUrl(id, function(url) {
                if (url) {
                    res.redirect(url);
                } else {
                    res.send({
                        "Error": "Invalid shortened url!"
                    });
                }
            });
        });
};
