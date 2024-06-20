const mongoose = require('mongoose');

const database = async() => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Database is connected')
    } catch (error) {
        console.error('Database could not be connected',error);
        
    }
}
module.exports = {database}

