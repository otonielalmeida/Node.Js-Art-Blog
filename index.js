const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const newPostRoute = require('./routes/newPost');
const managePostsRoute = require('./routes/managePosts');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT,
() => console.log('connected to DB'));

//middleware
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.set('views', './view');

//route middlewares
app.use('/user', authRoute);
app.use('/posts', postRoute);
app.use('/newPost', newPostRoute);
app.use('/managePosts', managePostsRoute)

app.listen(3000, () => console.log('Server running on http://localhost:3000/'));
