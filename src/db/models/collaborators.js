'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    email: DataTypes.STRING
  }, {});
  Collaborator.associate = function(models) {
    // associations can be defined here

    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

    Collaborator.addScope('collabsFor', (wikiId) => {
      return {
        include: [{
          model: models.User
        }],
        where: {wikiId: wikiId},
        order: [['createdAt', 'ASC']]
      }
    });

    Collaborator.addScope('collabsOf', (userId) => {
      return {
        include: [{
          model: models.Wiki,
        }],
        where: {userId: userId},
        order: [['createdAt', 'ASC']]
      }
    });
  };
  return Collaborator;
};