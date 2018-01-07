const User = require("../models/user");

const mongoose = require("mongoose");


const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


exports.getAll = (req, res, next) => {
    User.find()
        .exec()
        .then(result => {
            res.status(200).json(result); 
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};

exports.create = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length > 0) {
                return res.status(409).json({
                  message: "User already exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                      return res.status(500).json({
                        error: err
                      });
                    } else {
                      const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                      });
                      user
                        .save()
                        .then(result => {
                          console.log(result);
                          res.status(201).json({
                            message: "User created"
                          });
                        })
                        .catch(err => {
                          console.log(err);
                          res.status(500).json({
                            error: err
                          });
                        });
                    }
                  });
            }
        });         
};

exports.login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(users => {
            if(users.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }

            
            bcrypt.compare(req.body.password, users[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if(result) {
                    const token = jwt.sign({
                        email: users[0].email
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                    );

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {res.status(500).json({error: err})});
};

exports.delete = (req, res, next) => {
    const id = req.params.userId;
    User.remove({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted',
            });
        })
        .catch(err => {
            res.status(500).json({error: err});                        
        });
};