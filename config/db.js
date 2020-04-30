const mongoose = require('mongoose');

const connectDB = async () => {
    console.log(process.env.MONGOOSE_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);

}

module.exports = connectDB;