const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Authorizer = require("../policies/application");
const Collaborator = require('./models').Collaborator;

module.exports = {

    getAllWikis(callback){
        return Wiki.findAll()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            console.log(err)
            callback(err);
        })
    },

    addWiki(newWiki, callback){
        return Wiki.create(newWiki)
        .then((wiki) => {
            console.log(wiki);
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getWiki(id, callback){
        let returned = {};
        Wiki.findById(id, {
            include: [{
                model: Collaborator,
                as: "collaborators"
            }]
        })
        .then((wiki) => {
            if(!wiki){
                req.flash("notice", "No wiki found")
                callback(404);
            } else {
                returned['wiki'] = wiki;

                Collaborator.scope({ method: ['collabsFor', id]}).all()
                .then((collaborators) => {
                    returned['collaborators'] = collaborators;
                    callback(null, returned);
                })
                .catch((err) => {
                    callback(err);
                })
            }
        })
        .catch((err) => {
            console.log(err);
            callback(err);
        })
    },

    deleteWiki(req, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).destroy();

            if(authorized){
                wiki.destroy()
                .then((res) => {
                    callback(null, wiki);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.")
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },

    updateWiki(req, updatedWiki, callback){
        return Wiki.findById(req.params.id)
        .then((wiki) => {
            if(!wiki){
                return callback("Wiki not found");
            }

            const authorized = new Authorizer(req.user, wiki).update();

            if(authorized){
                wiki.update(updatedWiki, {
                    fields: Object.keys(updatedWiki)
                })
                .then(() => {
                    callback(null, wiki);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash("notice", "You are not authorized to do that.");
                callback("Forbidden");
            }
        });
    },

    publicizeWiki(id, callback){
        return Wiki.all()
        .then((wikis) => {
            wikis.forEach((wiki) => {
                if(wiki.userId == id && wiki.private == true) {
                    console.log(wiki);
                    wiki.update({private:false});
                }
            })
        })
        .catch((err) => {
            callback(err);
        })
    },

    getCollaborator(id, callback){
        return Collaborator.findById(id)
        .then((collaborator) => {
            callback(null, collaborator)
        })
        .catch((err) => {
            callback(err);
        })
    }
}
