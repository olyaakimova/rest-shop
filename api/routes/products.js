const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const ProductsController = require('../controllers/products.controller');

const uploadFile = require('../middleware/multer');

router.get('/', ProductsController.getAll);

router.post('/', checkAuth, uploadFile, ProductsController.create);

router.get('/:productId', ProductsController.getOne);

// example body [{"propName": "price","value": "15"},{"propName": "name","value": "15"}]
router.patch('/:productId', checkAuth, ProductsController.update);

router.delete('/:productId', checkAuth, ProductsController.delete);


module.exports = router;