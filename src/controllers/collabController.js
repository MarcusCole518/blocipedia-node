const collabQueries = require("../db/queries.collaborators");
const Authorizer = require("../policies/application");
const wikiQueries = require("../db/queries.wikis");
const User = require("../db/models").User;
const Wiki = require("../db/models").Wiki;
const markdown = require( "markdown" ).markdown;

module.exports = {

    new(req, res, next){
        const authorized = new Authorizer(req.user).new();

        if(authorized) {
            res.render('collabs/new', {wikiId: req.params.wikiId});
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect(`/wikis/${req.params.wikiId}`)
        }
    },

    create(req, res, next){
        collabQueries.addCollaborator(req, (err, collaborator) => {
            if(err){
                console.log(err);
                req.flash("notice", "There was an error adding this collaborator. Please try again later.")
                res.redirect(500, `/wikis/${req.params.wikiId}/collabs/new`);
            } else {
                res.redirect(303, `/wikis/${req.params.wikiId}`);
            }
        });
    },

    show(req, res, next){
        wikiQueries.getWiki(req.params.wikiId, (err, returned) => {
            wiki = returned['wiki'];
            collaborators = returned['collaborators'];

            if(err || returned.wiki == null){
                res.redirect(404, '/');
            } else {
                const authorized = new Authorizer(req.user, wiki, collaborators).edit();

                if(authorized){
                    res.render("collabs/show", {wiki, markdown, collaborators});
                } else {
                    req.flash("notice", "You are not authorized to do that.");
                    res.redirect(`/wikis/${req.params.wikiId}`)
                }
            }
        });
    },

    destroy(req, res, next){
        if(req.user) {
            collabQueries.deleteCollaborator(req.params.id, (err, collaborator) => {
                if(err){
                    console.log("error appeared -- ", err)
                    req.flash("notice", "There was an error deleting this collaborator. Please try again.");
                } else {
                    res.redirect(req.headers.referer)
                }
            })
        } else {
            req.flash("notice", "You must be signed in to do that.");
            res.redirect(req.headers.referer);
        }
    }
}

