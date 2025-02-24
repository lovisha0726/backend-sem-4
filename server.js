const express = require("express");
const path = require("path");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true })); // For form submissions
app.use(express.json()); // For handling JSON data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.set("view engine", "ejs"); // Set EJS as the view engine

// Redirect root `/` to `/posts`
app.get("/", (req, res) => {
    res.redirect("/posts");
});

// Blog Routes
app.use("/", blogRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
