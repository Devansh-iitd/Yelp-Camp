const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
UserSchema.plugin(passportLocalMongoose);
// this will add username and password to our schema
// and make sure that username is unique along with adding some methods to our schema
// like authenticate, serialize and deserialize

module.exports = mongoose.model('User', UserSchema);
