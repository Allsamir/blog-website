// All the requrie modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const _ = require('lodash');
const connectDB = require('./config/conn');
const mongoose = require('mongoose');
const dataSchema = require('./mongodb/posts');
const port = process.env.PORT || 3000;

// All the starting content

connectDB(); // connecting to the database

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum placerat elit, eu luctus turpis gravida vitae. Sed faucibus condimentum facilisis. Vivamus nunc tortor, faucibus sed diam ut, molestie viverra risus. Integer interdum lacinia nisi, convallis accumsan neque eleifend nec. Quisque ultrices, mi a dictum tempor, libero velit dignissim ex."

const aboutMeContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum condimentum placerat elit, eu luctus turpis gravida vitae. Sed faucibus condimentum facilisis. Vivamus nunc tortor, faucibus sed diam ut, molestie viverra risus. Integer interdum lacinia nisi, convallis accumsan neque eleifend nec. Quisque ultrices, mi a dictum tempor, libero velit dignissim ex."

const contactMeContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id tellus et nisl pretium porttitor. Praesent quam sapien, tincidunt non nulla rhoncus, consequat malesuada magna. Nulla non sapien est. Mauris ut diam faucibus, maximus turpis non, imperdiet libero. Donec dolor lectus, pellentesque et lacus in, vestibulum scelerisque mauris. Curabitur nec."

// All Methods to use with the help of app

app.set('view engine', 'ejs'); // to use ejs in our server

app.use(bodyParser.urlencoded({
  extended: true
})); // to get the users data and use it we need to use this

app.use(express.static("public")); // to use static files like css and if any img we wanna use, then we need to use this

// All get methods

const Post = mongoose.model("Post", dataSchema);

// After creating the post in the Post (posts) collection I am finding the data and then call backing the data and rendering it in the home route(which is my home page);

app.get("/", (req, res) => {

  Post.find()
    .then(posts => {
      res.render("home", {
        fpText: homeStartingContent, // this is a default data
        posts: posts
      })
      console.log(posts);
    })
    .catch(err => {
      console.error(err);
    })
});

app.get("/about-me", (req, res) => {

  res.render("about", {
    secondParagraph: aboutMeContent
  });
});


app.get("/contact", (req, res) => {

  res.render("contact", {
    thirdParagraph: contactMeContent
  });
})

app.get("/compose", (req, res) => {

  res.render("compose");
})

// In this get method when users want to see a individual data then using express route params we are getting users route and then converting it into lowercase using lowdash moduel and then in database's Post(posts) collection we call the find method and then call backing all the data and taking the title of the post and then checking if the requested path and the post title is same, if same then rendering the post.ejs(the title and the body of the post);

app.get("/:topic", (req, res) => {

  let reqestedPath = _.lowerCase(req.params.topic);

  Post.find()
    .then(posts => {
      posts.forEach((post) => {

        let lowerCaseTitle = _.lowerCase(post.title);

        if (reqestedPath == lowerCaseTitle) {

          res.render("posts", {
            title: post.title,
            body: post.body
          });

        }
      });
    })
})

// All post method

// In the compose page I am creating posts and then saving it in the database and then redirect to my home route 

app.post("/compose", (req, res) => {

  let title = req.body.blogTitle;
  let body = req.body.blogPost;

  const newPost = new Post({
    title: title,
    body: body
  });

  newPost.save();

  res.redirect("/");
})

mongoose.connection.once('open', () => {
  console.log("Connected to Database");
});
app.listen(port, () => {
  console.log("Server is runing at " + port);
});