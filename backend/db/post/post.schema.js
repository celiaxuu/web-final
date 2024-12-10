const Schema = require('mongoose').Schema;

exports.PostSchema = new Schema({
    content: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    collection: 'postsSpr2023',
    timestamps: true 
});