const mongoose = require('mongoose');

const CourseScheme = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a cource title"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    weeks: {
        type: String,
        required: [true, "Please add a number of weeks"]
    },
    tuition: {
        type: Number,
        required: [true, "Please add a tuition cost"]
    },
    minimumSkill: {
        type: String,
        required: [true, "Please add a minimum skill"],
        enum: ['beginner', 'intermediate', 'advance']
    },
    scholershipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Static method to get avg course tuitions
CourseScheme.statics.getAverageCost = async function(bootcampId) {

    // Pipeline method: Has some steps
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    // Put this in the DB
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10    
            // -> if(23 = 30) i.e to the nearest 10th value, (11 = 20), (10 = 10), (29 = 30)
        })
    } catch (err) {
        console.error(err);
    }
}

// Call getAverageCost after save
CourseScheme.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before save
CourseScheme.pre('remove', function() {
    this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseScheme);