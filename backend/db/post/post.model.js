const mongoose = require("mongoose");
const PostSchema = require('./post.schema').PostSchema;
const PostModel = mongoose.model("PostModel", PostSchema);

function createPost(post) {
    return PostModel.create(post);
}

function findPostsByUsername(username) {
    return PostModel.find({ username: username })
        .sort({ createdAt: -1 })
        .exec();
}

function getAllPosts() {
    return PostModel.find({})
        .sort({ createdAt: -1 })
        .exec();
}

function deletePost(postId, username) {
    return PostModel.findOneAndDelete({
        _id: postId,
        username: username
    }).exec();
}

function updatePost(postId, username, content) {
    return PostModel.findOneAndUpdate(
        { _id: postId, username: username },
        { content: content },
        { new: true }
    ).exec();
}

module.exports = {
    createPost,
    findPostsByUsername,
    getAllPosts,
    deletePost,
    updatePost
}