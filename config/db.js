require('dotenv').config();
const mongoose = require('mongoose');

const main = async () => {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    mongoose.connection.on('error', err => {
        console.log('DB Connection Error ' + err);
    })
    mongoose.connection.on('connected', res => {
        console.log('DB Connection Successful');
    })
}

main();