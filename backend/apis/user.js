const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const UserModel = require('../db/user/user.model');
const PostModel = require('../db/post/post.model');

router.post('/register', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    try {
        if(!username || !password) {
            return res.status(409).send("Missing username or password");
        }

        const createUserResponse = await UserModel.createUser({
            username: username,
            password: password,
            description: ''
        });

        const token = jwt.sign(username, "HUNTERS_PASSWORD");
        res.cookie("username", token);
        return res.send("User created successfully");
    
    } catch (e) {
        res.status(401).send("Error: username already exists");
    }
});

router.post('/login', async function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await UserModel.findUserByUsername(username);
        
        if (!user) {
            return res.status(401).send("User not found");
        }

        if (user.password !== password) {
            return res.status(403).send("Invalid password");
        }

        const token = jwt.sign(username, "HUNTERS_PASSWORD");
        res.cookie("username", token);
        
        return res.send("Login successful");
    } catch (e) {
        res.status(500).send("Error during login");
    }
});

router.get('/isLoggedIn', async function(req, res) {
    const username = req.cookies.username;
    if(!username) {
        return res.send({username: null});
    }

    try {
        const decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD");
        return res.send({username: decryptedUsername});
    } catch(e) {
        return res.send({username: null});
    }
});

router.post('/logOut', async function(req, res) {
    res.cookie('username', '', {
        maxAge: 0,
    });
    res.send(true);
});

router.get('/:username', async function(req, res) {
    try {
        const username = req.params.username;
        const userData = await UserModel.getUserPublicInfo(username);
        
        if (!userData) {
            return res.status(404).send("User not found");
        }

        res.json(userData);
    } catch (error) {
        res.status(500).send("Error fetching user data");
    }
});

router.put('/:username/description', async function(req, res) {
    try {
        const token = req.cookies.username;
        if (!token) {
            return res.status(401).send("Not authenticated");
        }

        const loggedInUsername = jwt.verify(token, "HUNTERS_PASSWORD");
        const targetUsername = req.params.username;

        if (loggedInUsername !== targetUsername) {
            return res.status(403).send("Unauthorized");
        }

        const { description } = req.body;
        const updatedUser = await UserModel.updateUserDescription(targetUsername, description);
        
        const { password, ...userWithoutPassword } = updatedUser.toObject();
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).send("Error updating description");
    }
});

router.get('/:username/posts', async function(req, res) {
    try {
        const username = req.params.username;
        const posts = await PostModel.findPostsByUsername(username);
        res.json(posts);
    } catch (error) {
        res.status(500).send("Error fetching user posts");
    }
});

module.exports = router;