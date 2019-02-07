const Collaborator = require("../db/models/").Collaborator;
const Wiki = require("../db/models").Wiki;
const User = require("../db/models").User;
const collabQueries = require("../db/queries.collaborators");
const userQueries = require("../db/queries.users");
const wikiQueries = require("../db/queries.wikis");
const Authorizer = require("../policies/application");
const markdown = require('markdown').markdown;

module.exports = {
    index(req, res, next){

        collabQueries.getAllCollaborators((err, collaborators) => {
            if(err){
                console.log(err);
                res.redirect(500, '/');
            } else {
                res.render('collabs/index', {collaborators})
            }
        })
    },

    new(req, res, next){
        const authorized = new Authorizer(req.user).new();

        if(authorized) {
            res.render('collabs/new', {wikiId: req.params.wikiId});
        } else {
            req.flash("notice", "You are not authorized to do that.");
            res.redirect(`/wikis/${wiki.id}/collabs/${collab.id}`)
        }
    },

    create(req, res, next){
        User.findOne({where: {email: req.body.email}})
        .then(user => {

            if(!user){
                req.flash("notice", "This user was not found. Please try again.");
                res.redirect(`/wikis/${wiki.id}`)
            } else {
                let newCollab = {
                    email: req.body.email,
                    userId: req.user.id,
                    wikiId: req.params.id
                };
                collabQueries.addCollaborator(newCollab, (err, collaborator) => {
                    if(err){
                        res.redirect(500, '/collabs/new');
                    } else {
                        res.render('collabs/show', {collaborator});
                    }
                });
            }
        })
    },

    show(req, res, next){
        collabQueries.getCollaborator(req.params.id, (err, collaborator) => {
            if(err || collaborator == null){
                res.redirect(404, '/');
            } else {
                res.render('collabs/show', {collaborator});
            }
        });
    },

    destroy(req, res, next){
        collabQueries.deleteCollaborator(req.params.id, (err, collaborator) => {
            if(err){
                res.redirect(err, `/wikis/${req.params.wikiId}/collabs/${req.params.id}`)
            } else {
                res.redirect(303, `/wikis/${req.params.wikiId}/collabs`)
            }
        })
    }
}

