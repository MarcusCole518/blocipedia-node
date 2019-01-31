const Wiki = require("./models").Wiki;
const User = require("./models").User;

module.exports = {

    getAllWikis(callback){
        return Wiki.findAll()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        })
    }
}