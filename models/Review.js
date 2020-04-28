const mongoose = require('mongoose');

const ReviewScheme = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a title for the review"],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, "Please add some text"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, "Please add a rating between 1 and 10"]
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

// Preventing user from submitting more than one review per bootcamp
ReviewScheme.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewScheme.statics.getAverageRating = async function(bootcampId) {

    // Pipeline method: Has some steps
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    // Put this in the DB
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating 
        });
    } catch (err) {
        console.error(err);
    }
}

// Call getAverageRating after save
ReviewScheme.post('save', function() {
    this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageCost before save
ReviewScheme.pre('remove', function() {
    this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewScheme);