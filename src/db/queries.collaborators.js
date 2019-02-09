const Collaborator = require("./models").Collaborator;
const User = require("./models").User;
const Wiki = require('./models').Wiki;
const Authorizer = require("../policies/application");

module.exports = {

    addCollaborator(req, callback){
        User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then((user) => {
            if(!user){
                return callback(404, "no user found");
            } else {

                Collaborator.findOne({
                    where: {
                        userId: user.id,
                        wikiId: req.params.wikiId
                    }
                })
                .then((collaborator) => {
                    if(collaborator){
                        return callback("This user has already been added as a collaborator.")
                    } else {
                        return Collaborator.create({
                            userId: user.id,
                            wikiId: req.params.wikiId,
                            email: markdown.toHTML(req.body.email)
                        })
                        .then((collaborator) => {
                            console.log(collaborator)
                            callback(null, collaborator)
                        })
                        .catch((err) => {
                            console.log("ERROR APPEARED: ", err)
                            callback(err);
                        })
                    }
                })
            }
        })
    },

    deleteCollaborator(id, callback){
            return Collaborator.destroy({where: {id}})
            .then((collaborator) => {
                callback(null, collaborator);
            })
            .catch((err) => {
                console.log("Error Appeared", err);
                callback(err);
            })

    }
}