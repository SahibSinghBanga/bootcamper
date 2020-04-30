const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Bootcamp = require('../models/Bootcamp');
const Course = require('../models/Course');

/** 
 * @desc    Get All Users   
 * @route   GET /api/v1/auth/users
 * @access  Private/Admin
**/
exports.whoAmI = asyncHandler(async (req, res, next) => {

    const whoId = req.params.id;

    const user = await User.findById(whoId);
    const bootcamp = await Bootcamp.findById(whoId);
    const course = await Course.findById(whoId);

    if(user) {
        return res.status(200).json({
                    success: true,
                    whoAmI:"USER",
                    data: user
                });
    } else if(bootcamp){
        return res.status(200).json({
            success: true,
            whoAmI:"BOOTCAMP",
            data: bootcamp
        });
    } else if(course) {
        return res.status(200).json({
            success: true,
            whoAmI:"COURSE",
            data: course
        });
    } else {
        return next(new ErrorResponse("Invalid Id", 404));
    }

});
