const express = require("express");
const router = express.Router();

const UsersController = require('../controllers/users.controller');

router.get('/', UsersController.getAll);

router.post('/signup', UsersController.create);

router.post('/login', UsersController.login);

router.delete('/:userId', UsersController.delete);

module.exports = router;


/*
BCRYPT
CREATE A HASH
bcrypt.hash(myPlaintextPassword, saltRounds, (err, hash) => {
  if no error proceed to creating a user
});
CHECK A HASH
bcrypt.compare(myPlaintextPassword, hash, (err, res) => {
    if no error generate and send a token
});
*/