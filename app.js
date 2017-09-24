var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// calling mongoose module 
var mongoose = require('mongoose');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));

var dateMiddleWare=require('./dateRangeMiddleware.js')
//lets define configuration of database 

var dbPath  = "mongodb://localhost/myblogapplication";

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

	console.log("database connection open success");

});

// include the model file 

var Blog = require('./blogModel.js');

var blogModel = mongoose.model('Blog');
var commentModel=mongoose.model('Comment');

///Create a blog
app.post('/blog/create',function(req, res){
	var bm=new blogModel();
	bm.title=req.body.title;
	bm.text=req.body.text;
	var author={};
	//author.username = req.body.username;
	if(req.body.username && req.body.username!=''){
		author.username = req.body.username;
	}
	else{
		author.username = 'anonymousAuthor'
	}
	bm.author=author;
	bm.save(function(error){
			if(error){
				console.log(error);
				res.send(error);

			}
			else{
				console.log(bm);
				res.send(bm);
			}

		}); 

	});



//// Post comments in a blog ////
app.post('/blog/:id/comment/create',function(req,res){
	console.log('what is id');
	console.log(req.params.id);
	var comment=new commentModel();
	comment.text=req.body.commentText;
	var author={};
	//author.username=req.body.commentUser;
	if(req.body.commentUser && req.body.commentUser!=''){
		author.username = req.body.commentUser;
	}
	else{
		author.username = 'anonymousUser'
	}
	comment.author=author;
	blogModel.findOne({_id:req.params.id},function(err,blogInfo)
	{
		if(err)
		{
			res.send(err);
		}
		else
		{
			if(blogInfo)
			{
				blogInfo.comments.push(comment);
				blogInfo.save(function(err){
					if(err)
					{
						console.log(err);
						res.send(err);
					}
					else
					{
						res.send(blogInfo);
					}
				});
				//res.send(blogInfo);
			}
			else
			{
				res.send("blogInfo not found");
			}
		}
	})
});


///Get all the blogs
app.get('/allBlogs',function(req,res){
	blogModel.find(function(err,result){
		if(err){
				res.send(err);
		}
		else{
			res.send(result);
		}

    });
});


//Get a particular blog
app.get('/allBlogs/:id',function(req,res){
	blogModel.findOne({'_id':req.params.id},function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
});

//Delete a particular blog
app.post('/allBlogs/:id/delete',function(req,res){
	blogModel.remove({'_id':req.params.id},function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
});


//Edit a particular blog
app.put('/allBlogs/:id/edit',function(req,res){
	var update=req.body;
	blogModel.findOneAndUpdate({'_id':req.params.id},update,function(err,result){
		if(err){
			res.send(err);
		}
		else{
			res.send(result);
		}
	});
});


//get all comments of a blog
app.get('/allblogs/:id/comment',function(req,res){
	blogModel.findOne({'_id':req.params.id},function(err,blogInfo){
		if(err){

			res.send(err);
		}
		else{
			res.send(blogInfo.comments)
		}
	});
});


//Retrieve a blog on a particular date
app.get('/blogs/particularDate',dateMiddleWare.dateRangeFilter,function(req,res){
	blogModel.find({
		"createDate":{"$gte":req.createdDateTime,"$lt":	req.nextDateTime }},function(err,result){
			if(err){
				res.send(err);
			}
			else{
				res.send(result);
			}
		});

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
