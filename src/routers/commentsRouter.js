const express = require('express');
const validateInput = require('../helpers/validation');
const commentsController = require('../controllers/commentsController');

const router = express.Router();

router.get('/', commentsController.getComments);
router.get('/:id', commentsController.getComment);
router.post('/', commentsController.createComment);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;