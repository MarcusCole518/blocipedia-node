'use strict';


const faker = require("faker");

let users = [];

for(let i = 1 ; i <= 5 ; i++){
  users.push({
    email: faker.internet.email(),
    password: faker.hacker.noun(),
    role: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

  return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

  return queryInterface.bulkDelete("Users", null, {});
  }
};
