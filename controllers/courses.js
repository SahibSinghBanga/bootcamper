const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

/** 
 * @desc    Get courses    
 * @route   GET /api/v1/courses
 * @route   GET /api/v1/bootcamps/:bootcampId/courses
 * @access  Public
**/
exports.getCourses = asyncHandler(async (req, res, next) => {
    // Function for single course based on ID
    if(req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });

        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        // Fetch all courses irrespective of ID
        res.status(200).json(res.advancedResults)
    }
});

/** 
 * @desc    Get single courses    
 * @route   GET /api/v1/courses/:id
 * @access  Public
**/
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }
    
    res.status(200).json({
        success: true,
        data: course
    });
});

/** 
 * @desc    Add course    
 * @route   POST /api/v1/bootcamps/:bootcampId/courses
 * @access  Private
**/
exports.addCourse = asyncHandler(async (req, res, next) => {

    // Along the course, it requires a bootcampId to w/c is should be saved
    req.body.bootcamp = req.params.bootcampId;

    // Finding Bootcamp
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    // Check bootcamp exist, then add the course to it
    if(!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);
    }
    
    // Creating the course
    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    });
});

/** 
 * @desc    Update course    
 * @route   PUT /api/v1/courses/:id
 * @access  Private
**/
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.bootcampId}`), 404);
    }
    
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

/** 
 * @desc    Delete course    
 * @route   DELETE /api/v1/courses/:id
 * @access  Private
**/
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.bootcampId}`), 404);
    }
    
    await course.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});