const mongoose = require("mongoose");
const UserSchema = require('./user.schema').UserSchema;
const UserModel = mongoose.model("UserModel", UserSchema);

function createUser(user) {
    return UserModel.create(user);
}

function findUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}

function updateUserDescription(username, description) {
    return UserModel.findOneAndUpdate(
        { username: username },
        { description: description },
        { new: true }
    ).exec();
}

function getUserPublicInfo(username) {
    return UserModel.findOne(
        { username: username },
        { password: 0 }
    ).exec();
}

function getAllUsers() {
    return UserModel.find({}, { password: 0 }).exec();
}

module.exports = {
    createUser,
    findUserByUsername,
    updateUserDescription,
    getUserPublicInfo,
    getAllUsers
}