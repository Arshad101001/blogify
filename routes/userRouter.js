const {Router} = require('express');
const { createHmac, randomBytes } = require('node:crypto');
const User = require('../models/userModel');
const { createTokenForUser } = require('../services/authentication');
const Blog = require('../models/blogModel');
const router = Router();

router.get('/', async (req, res)=>{
    const allBlog = await Blog.find({});
    res.render('home', {
        // user: req.user,
        // blogs: allBlog,
    });
});

router.get('/signin', (req, res)=>{
    return res.render("signin");
});

router.get('/signup', (req, res)=>{
    return res.render("signup");
});

router.post('/signup', async (req, res)=>{
    const {fullName, email, password} = req.body;
    // console.log(req.body);
    
    await User.create({
        fullName: fullName,
        email: email,
        password: password,

    });

    return res.redirect('/signin');
});

router.post('/signin', async (req, res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if(!user){
        console.log("User not found");
        return res.render('signin', {
            err: "User not found"
        });
    }
    
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", user.salt)
    .update(password).digest("hex");
    
    if (hashedPassword === user.password) {
        console.log("Logged in");
        const token = createTokenForUser(user);
        // res.render('nav', {success: "Successfully Logged in!!"});
        return res.cookie('token', token).redirect('/');
    }
    else {
        return res.render('signin', {
            err: "Incorrect password"
        });
    }
});

router.get('/logout', (req, res)=>{
    res.clearCookie('token').redirect('/');
})



module.exports = router;