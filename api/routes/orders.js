const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders.controller');


router.get('/', checkAuth, OrdersController.getAll);

router.post('/', checkAuth, OrdersController.create);

router.get('/:orderId', checkAuth, OrdersController.getOne);

router.delete('/:orderId', checkAuth, OrdersController.delete);

module.exports = router;