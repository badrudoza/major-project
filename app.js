const express= require("express");
const app=express();
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");

const mongoose=require("mongoose");

const path=require("path");

const ejsMate=require("ejs-mate");

const ExpressError=require("./utils/ExpressError.js");
const wrapAsync=require("./utils/wrapAsync");

const listing=require("./routes/listing.js");
const reviews=require("./routes/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);

app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
	console.log("connected succesfullly");
}).catch((err)=>{
	console.log(err);
});

async function main() {
	await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.listen(8080,()=>{
	console.log("app is listening at port ",8080);
});

app.get("/",(req,res)=>{
	res.send("working");
});

app.use("/listing",listing);

app.use("/listings/:id/review",reviews);


app.use((err,req,res,next)=>{
	let {statuscode=404,message="page not found"}=err;
	res.status(statuscode).send(message);
});
