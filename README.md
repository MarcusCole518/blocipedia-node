# Blocipedia
# <a href="https://ibb.co/jZmQLfM"><img src="https://i.ibb.co/S7bMKyn/Screen-Shot-2019-02-13-at-9-43-46-PM.png" alt="Screen-Shot-2019-02-13-at-9-43-46-PM" border="0"></a>
## Table of Contents
* [Introduction](#introduction)
* [Setup](#setup)
* [Upgrades](#upgrades)
* [Technologies](#technologies)
* [Heroku](#heroku)

## Introduction
*Blocipedia is a Node.js web application that allows users to share stories, and collaborate on posts. Users can upgrade to the Premium version to access private wikis.*
## Setup
* Clone this repository: `git clone git@github.com:MarcusCole518/blocipedia-node.git`
* Install it locally using npm:
```
cd blocipedia-node
npm install 
npm start
```
## Upgrades

Blocipedia uses Stripe to accept credit card payments for upgrading user accounts. To upgrade with Stripe in the dev environment:

* From the home screen, select 'Upgrade Account' at the bottom.
* Choose 'Pay with Card' to begin Stripe upgrade process.

<a href="https://imgbb.com/"><img src="https://i.ibb.co/nr9CpqJ/Screen-Shot-2019-02-13-at-9-44-39-PM.png" alt="Screen-Shot-2019-02-13-at-9-44-39-PM" border="0"></a>

#### Genuine card information cannot be used in Blocipedia, but users can upgrade by using one of Stripe's specified test card numbers:

<a href="https://ibb.co/Q8V8g48"><img src="https://i.ibb.co/n3y3GF3/Screen-Shot-2019-02-13-at-9-41-02-PM.png" alt="Screen-Shot-2019-02-13-at-9-41-02-PM" border="0"></a>

*A full list of test card numbers can be found here: https://stripe.com/docs/testing#cards*

* Enter an expiration date that is any date in the future, and select an arbitrary 3 digit security code.

## Technologies
* [Node](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [Sendgrid](https://sendgrid.com/)
* [Stripe](https://stripe.com/)
* [Passport.js](http://www.passportjs.org/)
### Heroku
