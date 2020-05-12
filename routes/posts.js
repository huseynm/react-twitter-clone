const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Post = require('../models/Post');

// @route POST api/posts
// @desc Add a post
router.post('/', [auth, [
    check('content', 'Name is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { content, likeCount, replyCount } = req.body;
    try {
        const newPost = new Post({
            content,
            likeCount,
            replyCount,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;