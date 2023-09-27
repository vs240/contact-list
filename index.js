require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const session=require("express-session");
const app=express();
const port=process.env.PORT||3000;
app.set("view-engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("uploads"));
app.use(session({
    secret : "my secret key",
    saveUninitialized: true,
    resave:false,
}))
app.use((req,res, next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})
const connectDB=async()=>{
    try{
         const conn=await mongoose.connect(process.env.DB_URI,{
            useNewUrlParser:true,
            useUnifiedTopology: true,
         })
         console.log(`mongodb connected : ${conn.connection.host}`)
    }
    catch(err)
    {
        console.log(err);
    }
}
connectDB();
app.use("",require("./routes/routes"));
app.get("/",(req,res)=>{
    res.send("ohm namo ganptate namah");
})
app.listen(port,()=>{
    console.log(`the server is running at ${port}`);
})
