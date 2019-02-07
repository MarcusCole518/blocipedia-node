const express = require("express");
const router = express.Router();
const collabController = require('../controllers/collabController');

router.get('/wikis/:wikiId/collabs/', collabController.index);
router.get('/wikis/:wikiId/collabs/new', collabController.new);
router.post('/wikis/:wikiId/collabs/create', collabController.create);
router.get('/wikis/:wikiId/collabs/:id', collabController.show);
router.post('/wikis/:wikiId/collabs/:id/destroy', collabController.destroy);

module.exports = router;