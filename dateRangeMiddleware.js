exports.dateRangeFilter=function(req,res,next){
	var createdDate=new Date(req.query.createDate);
	console.log(req.query.createDate);
	if (isNaN(createdDate)){
		res.send("Please provide a valid date in valid format");
	}
	var nextDate=new Date(req.query.createDate);
	nextDate.setDate(nextDate.getDate()+1);
	req.createdDateTime = createdDate.getTime();
	req.nextDateTime  = nextDate.getTime();
	next();
}