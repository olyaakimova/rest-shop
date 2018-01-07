
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const verified = jwt.verify(token, process.env.JWT_KEY);
        req.userData = verified;
        next();
        
    }
    catch(err) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};


/*
concept:
1. export a function which conducts the auth check
2. try catch to handle errors
3. if the token is verified and auth succeeds, next() to allow access to the route
middleware to check authorization token
token is send in a header Bearer TOKEN
split the token to remove Bearer 
jwt.verified decodes and verifies the token sent from the client
the middleware is called as an argument in the route which needs to be protected first after the path
*/