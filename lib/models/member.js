const mongoose = require('mongoose');
const passportLM = require('passport-local-mongoose');
const { Schema } = mongoose;
const memberSchema = new Schema({
    // username: {
    //     type: String, 
    //     required: [true, 'Username cannot be blank']
    // },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    // password: {
    //     type: String, 
    //     required: [true, 'Password is required']
    // }
});
memberSchema.plugin(passportLM);
const Member = mongoose.model('Member', memberSchema);
module.exports = Member;