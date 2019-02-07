const Collaborator = require("./models").Collaborator;
const User = require("./models").User;
const Wiki = require('./models').Wiki;
const bcrypt = require('bcryptjs');

module.exports = {

    getAllCollaborators(callback){
        return Collaborator.all()
        .then((collaborators) => {
            callback(null, collaborators);
        })
        .catch((err) => {
            callback(err);
        })
    },

    addCollaborator(newCollab, callback){
        return Collaborator.create(newCollab)
        .then((collaborator) => {
            callback(null, collaborator)
        })
        .catch((err) => {
            callback(err);
        })
    },

    getCollaborator(id, callback){
        return Collaborator.findById(id)
        .then((collaborator) => {
            callback(null, collaborator);
        })
        .catch((err) => {
            callback(err);
        })
    },

    deleteCollaborator(id, callback){
        return Collaborator.destroy({where: {id}})
        .then((collaborator) => {
            callback(null, collaborator);
        })
        .catch((err) => {
            callback(err);
        })
    }
}