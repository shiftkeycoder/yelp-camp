const mongoose = require('mongoose');
const { Schema } = mongoose;
const memberSchema = new Schema({
    username: {
        type: String, 
        required: [true, 'Username cannot be blank']
    }, 
    password: {
        type: String, 
        required: [true, 'Password is required']
    }
});
const Member = mongoose.model('Member', memberSchema);
module.exports = Member;