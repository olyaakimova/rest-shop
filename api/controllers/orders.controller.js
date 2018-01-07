const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.getAll = (req, res, next) => {
    Order.find()
        .populate('product', 'name price')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        }
        );
};

exports.create = (req, res, next) => {
    console.log(req.body)

    Product.findById(req.body.product)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.product,
                quantity: req.body.quantity
            });
            return order.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Order is created',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result.product
                }
            });
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });

};

exports.getOne = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .select('_id product quantity')
        .populate('product', 'name price')
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc);
                res.status(200).json({
                    order: {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity
                    },
                    requests: [
                        {
                            type: 'GET',
                            description: 'All orders',
                            url: 'http://localhost:3000/orders'
                        },
                        {
                            type: 'GET',
                            description: 'Product',
                            url: 'http://localhost:3000/products/' + doc.product
                        }
                    ]
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for requested id: ' + id,
                    requestedId: id,
                    status: res.statusCode
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.delete = (req, res, next) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'GET',
                description: 'Get all orders',
                url: 'http://localhost:3000/orders'
            }
        });    
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});            
    }); 
};