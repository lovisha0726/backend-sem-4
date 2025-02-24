const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const postsFile = path.join(__dirname, "../data/posts.json");
if (!fs.existsSync(postsFile)) {
    fs.writeFileSync(postsFile, "[]", "utf-8");
}

const readPosts = () => {
    try {
        const data = fs.readFileSync(postsFile, "utf-8");
        return JSON.parse(data) || [];
    } catch (error) {
        console.error("Error reading posts:", error);
        return [];
    }
};
const writePosts = (posts) => {
    try {
        fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
        return true;
    } catch (error) {
        console.error("Error writing posts:", error);
        return false;
    }
};
router.get("/posts", (req, res) => {
    const posts = readPosts();
    res.render("index", { posts });
});

router.get("/post", (req, res) => {
    const postId = parseInt(req.query.id);
    const posts = readPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).render("error", { message: "Post not found" });
    }

    res.render("post", { post });
});
router.get("/add-post", (req, res) => {
    res.render("add-post");
});

router.post("/add-post", (req, res) => {
    const { title, content } = req.body;

    if (!title || !content || typeof title !== "string" || typeof content !== "string") {
        return res.status(400).send("Invalid title or content");
    }

    const posts = readPosts();
    
    const newPost = {
        id: posts.length ? Math.max(...posts.map(p => p.id)) + 1 : 1,
        title: title.trim(),
        content: content.trim(),
    };

    posts.push(newPost);

    if (writePosts(posts)) {
        res.redirect("/posts");
    } else {
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
