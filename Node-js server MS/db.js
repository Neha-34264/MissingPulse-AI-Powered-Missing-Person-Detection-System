const mongoose = require('mongoose');

// Set the 'strictQuery' option to avoid deprecation warnings
mongoose.set('strictQuery', false);

const connectToMongo = async () => {
    try {
        // MongoDB connection URI (replace with your actual database name)
        const uri = 'mongodb://localhost:27017/missingpersons'; // Check your Mongo URI here
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

module.exports = connectToMongo;
