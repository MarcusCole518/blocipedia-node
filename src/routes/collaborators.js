const express = require("express");
const router = express.Router();
const collabController = require('../controllers/collabController');
const helper = require("../auth/helpers");

router.get('/wikis/:wikiId/collabs/new', collabController.new);
router.post('/wikis/:wikiId/collabs/create', helper.ensureAuthenticated, collabController.create);
router.get('/wikis/:wikiId/collabs', collabController.show);
router.post('/wikis/:wikiId/collabs/:id/destroy', collabController.destroy);

module.exports = router;