const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(result => {
            res.status(200).json(result); 
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.post('/signup', (req, res, next) => {
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
});

router.post('/login', (req, res, next) => {
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
});

router.delete('/:userId', (req, res, next) => {
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
});

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