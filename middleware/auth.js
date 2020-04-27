const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        token = req.headers.authorization.split(" ")[1];

    } 

    // else if(req.cookies.token) {
        
    //     token = req.cookies.token;
    // }


    // Make sure token exists in either req or cookie
    if(!token) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    // If it token does exists
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id); // Logged in user ( always )

        next();
    } catch (err) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }
});