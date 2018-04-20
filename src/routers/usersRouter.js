const express = require('express');
const validateInput = require('../helpers/validation');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;