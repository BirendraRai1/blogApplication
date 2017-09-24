var mongoose=require('mongoose');
var Schema=mongoose.Schema;
  Comment = new Schema({
        text:{
            type:String,
            required:true
        },
        author:{
            username:String,
            required:false,
        },
        createDate:{
            type:String,
            required:false,
            default: Date.now
        }
    });

    Blog = new Schema({
        title:{
            type:String,
            required:true
        },
        text:{
            type:String,
            required:true
        },
        author:{
            username:String,
            required:false,
        },
        comments: {type: [Comment]},
        createDate:{
            type:Date,
            required:false,
            default: Date.now
        }
    });
mongoose.model('Blog',Blog);
mongoose.model('Comment',Comment);