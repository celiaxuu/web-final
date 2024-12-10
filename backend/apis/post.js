const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const PostModel = require('../db/post/post.model');

router.get('/', async (req, res) => {
    try {
        const posts = await PostModel.getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).send("Error fetching posts");
    }
});

router.post('/', async (req, res) => {
    const token = req.cookies.username;
    if (!token) {
        return res.status(401).send("Not authenticated");
    }

    try {
        const username = jwt.verify(token, "HUNTERS_PASSWORD");
        const post = {
            content: req.body.content,
            username: username
        };
        
        const newPost = await PostModel.createPost(post);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).send("Error creating post");
    }
});

router.get('/user/:username', async (req, res) => {
    try {
        const posts = await PostModel.findPostsByUsername(req.params.username);
        res.json(posts);
    } catch (error) {
        res.status(500).send("Error fetching user posts");
    }
});

router.delete('/:postId', async (req, res) => {
    const token = req.cookies.username;
    if (!token) {
        return res.status(401).send("Not authenticated");
    }

    try {
        const username = jwt.verify(token, "HUNTERS_PASSWORD");
        const result = await PostModel.deletePost(req.params.postId, username);
        if (!result) {
            return res.status(404).send("Post not found or unauthorized");
        }
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).send("Error deleting post");
    }
});

router.put('/:postId', async (req, res) => {
    const token = req.cookies.username;
    if (!token) {
        return res.status(401).send("Not authenticated");
    }

    try {
        const username = jwt.verify(token, "HUNTERS_PASSWORD");
        const result = await PostModel.updatePost(
            req.params.postId,
            username,
            req.body.content
        );
        if (!result) {
            return res.status(404).send("Post not found or unauthorized");
        }
        res.json(result);
    } catch (error) {
        res.status(500).send("Error updating post");
    }
});

module.exports = router;