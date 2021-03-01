var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            
            res.render("comments/new",{campground:campground});
        }
    }); 
});
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
         Comment.create(req.body.comment, function(err, comment){
            if(err){
                console.log(err);
            } else {
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Successfully added comment");
                res.redirect('/campgrounds/' + campground._id);
            }
         });
        }
    });
 });

 //Comment Edit Route
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "No Campground Found");
            res.redirect("back");
        }
        Comment.findById(req.params.comment_id,function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                res.render("comments/edit",{campground_id:req.params.id, comment: foundComment});
            }
    });
    
    });
});

//Comment Update route
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//Delete Route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

 //Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
