require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    const userNew = new User({
        email: req.body.username,
        password: req.body.password
    });

    await userNew.save();

    res.render("secrets");
})

app.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;

    const foundUser = await User.findOne({email: email});

    if (foundUser) {
        if (foundUser.password === password) {
            res.render("secrets");
        }
    }
});

app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});