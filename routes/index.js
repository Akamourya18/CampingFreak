var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")


router.get("/",function(req,res){
    res.render("landing");
});


//===========
//Auth ROute
//===========

//SHow register Form
router.get("/register",function(req,res){
    res.render("register");
});
//Handle sign up logic
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/campgrounds");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/campgrounds");
        });
    });
});
// LOGIN ROUTES
//render login form
router.get("/login", function(req, res){
    res.render("login"); 
 });
 //login logic
 //middleware
 router.post("/login", passport.authenticate("local", {
     successRedirect: "/campgrounds",
     failureRedirect: "/campgrounds" 
 }) ,function(req, res){
 });

 //logout route
 router.get("/logout",function(req,res){
     req.logout();
     req.flash("success", "Logged you out")
     res.redirect("/campgrounds");
 });

 function isLoggedIn(req,res,next){
     if(req.isAuthenticated()){
         return next();
     }
     res.redirect("/login");
 }

module.exports = router;
