const express = require('express');
const validateInput = require('../helpers/validation');
const postsController = require('../controllers/postsController');

const router = express.Router();

router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPost);
router.post('/', postsController.createPost);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);

module.exports = router;