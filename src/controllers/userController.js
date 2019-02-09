const userQueries = require("../db/queries.users.js");
const passport = require("passport");
// const sgMail = require('@sendgrid/mail');
const express = require('express');
const router = express.Router();
const wikiQueries = require("../db/queries.wikis");
const markdown = require( "markdown" ).markdown;

module.exports = {
    signUp(req, res, next){
      res.render("users/sign_up");
    },

    create(req, res, next){
      let newUser = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation
      };

      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      // const msg = {
      //   to: req.body.email,
      //   from: 'mcolelittle@gmail.com',
      //   subject: 'Welcome to Blocipedia!',
      //   text: 'Log in and create a wiki to get started.',
      //   html: '<strong>Log in and create a wiki to get started.</strong>',
      // };
      // sgMail.send(msg);

      userQueries.createUser(newUser, (err, user) => {
        if(err){
          req.flash("error", err);
          res.redirect("/users/sign_up");
        } else {
          passport.authenticate("local")(req, res, () => {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          })
        }
      })
    },

    signInForm(req, res, next){
      res.render("users/sign_in");
    },

    signIn(req, res, next){
      passport.authenticate("local")(req, res, function () {
        if(!req.user){
          req.flash("notice", "Sign in failed. Please try again.")
          res.redirect("/users/sign_in");
        } else {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        }
      })
    },

    signOut(req, res, next){
      req.logout();
      req.flash("notice", "You've successfully signed out!");
      res.redirect("/");
    },

    upgradeForm(req, res, next){
      res.render("users/upgrade");
    },

    upgrade(req, res, next){
      var stripe = require("stripe")("sk_test_h8JjTiNxk3fnriPAs9rnTi5F");

      const token = req.body.stripeToken;
      const charge = stripe.charges.create({
        amount: 1500,
        currency: 'usd',
        description: 'Upgrade Charge',
        source: token,
        statement_descriptor: "User Upgrade",
        capture: false,
      });

      userQueries.upgrade(req.params.id, (err, user) => {
        if(err){
          req.flash("Payment was unsuccessful. Please try again later.");
          res.redirect("/users/upgrade");
        } else {
          req.flash("notice", "Thank you for becoming a Premium Member! You can now create private wikis.");
          res.redirect("/");
        }
      })
    },

    downgradeForm(req, res, next){
      res.render("users/downgrade");
    },

    downgrade(req, res, next){
      userQueries.downgrade(req.params.id, (err, user) => {
        if(err){
          req.flash("notice", "Downgrade unsuccessful. Please try again.");
          res.redirect("/users/downgrade");
        } else {
          wikiQueries.publicizeWiki(req.params.id);
          req.flash("notice", "Downgrade successful. You are now a standard user.");
          res.redirect("/");
        }
      });
    },

    showCollabs(req, res, next){
      userQueries.getUser(req.user.id, (err, returned) => {
        user = returned['user'];
        collaborations = returned['collaborations'];

        if(err || user == null){
          console.log(err);
          res.redirect(404, '/');
        } else {
          res.render('users/collabs', {user, markdown, collaborations});
        }
      })
    }
  }