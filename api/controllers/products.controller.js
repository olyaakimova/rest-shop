const Product = require('../models/product');
const mongoose = require('mongoose');


exports.getAll = (req, res, next) => {
    Product.find()
        // .select('name price _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                // mapping allows to return the changed array
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };
            // if (docs.length > 0) {
            res.status(200).json(response);
            // } else {
            //     res.status(404).json({
            //         message: 'No valid entry found in the database', 
            //         status: res.statusCode
            //     });
            // }                        
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        }
        );
};

exports.create = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path 
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Product is created',
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result.id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

exports.getOne = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                console.log(doc);                
                // res.status(200).json(doc); 
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'Get all products',
                        url: 'http://localhost:3000/products'
                    }
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
            res.status(500).json({error: err});
        });
};

exports.update = (req, res, next) => {
    const id = req.params.productId;  
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Product updated",
                request: {
                    type: 'GET',
                    description: 'Details of the updated product',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};

exports.delete = (req, res, next) => {
    const id = req.params.productId;   
    Product.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/products'
                }
            });    
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});            
        });  
};