const mogoose = require('mongoose');
const { use } = require('../routes/auth');

const userSchema = new mogoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});


module.exports = mogoose.model('User', userSchema);