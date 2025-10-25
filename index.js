require('dotenv').config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie} = require('./middlewares/authMiddleware');


const userRouter = require('./routes/userRouter');
const blogRouter = require('./routes/blogRouter');


const app = express();
const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URL).then(() => console.log("MongoDB Connected!!"))

app.set('view engine', "ejs");
app.set('views', path.resolve('./views'));
app.use(express.static('views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));



app.use('/', userRouter);
app.use('/blog', blogRouter);

app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));