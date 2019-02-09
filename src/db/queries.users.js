const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Collaborator = require("./models").Collaborator;

module.exports = {
    createUser(newUser, callback){

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            email: newUser.email,
            name: newUser.name,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    },

    getUser(id, callback){
        let returned = {};
        User.findById(id)
        .then((user) => {
            if(!user){
                return callback(404);
            } else {
                returned['user'] = user;
                Collaborator.scope({method: ['collabsOf', id]}).all()
                .then((collaborations) => {
                    returned['collaborations'] = collaborations;
                    callback(null, returned);
                })
                .catch((err) => {
                    console.log("Error Appeared", err)
                    callback(err);
                })
            }
        })
    },

    upgrade(id, callback){
        return User.findById(id)
        .then((user) => {
            if(!user){
                return callback("No user found")
            } else {
                user.update({role: 1})
                .then((user) => {
                    callback(null, user)
                })
                .catch((err) => {
                    callback(err);
                })
            }
        })
        .catch((err) => {
            callback(err);
        })
    },

    downgrade(id, callback){
        return User.findById(id)
        .then((user) => {
            if(!user){
                return callback("User not found");
            } else {
                user.update({role: 0})
                .then((user) => {
                    callback(null, user);
                })
                .catch((err) => {
                    callback(err);
                })
            }
        })
    }
}