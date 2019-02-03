const User = require("./models").User;
const bcrypt = require("bcryptjs");

module.exports = {
    createUser(newUser, callback){

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
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