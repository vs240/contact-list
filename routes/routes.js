const express = require("express");
const router=express.Router();
const User =require("../models/users");
const multer=require("multer");
const fs=require("fs");
var storage=multer.diskStorage({
   destination:function(req, file, cb){
      cb(null, './uploads');
   },
   filename: function(req,file, cb){
      cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname); 
   }
})
var upload = multer({
   storage:storage,
}).single("image");
router.post("/add",upload,(req,res)=>{
   const user=new User({
      name:req.body.name,
      email:req.body.email,
      phone:req.body.phone,
      image:req.file.filename,
   })
   user.save().then(req.session.message={
      type: "success",
      message:'User Added Successfully'
})
res.redirect('/')
     
      
})
router.get("/", async (req, res) => {
   try {
      const users = await User.find().exec();
      res.render("index.ejs", {
         title: "Home Page",
         users: users,
      });
   } catch (err) {
      console.error(err); // Log the error to the console
      res.json({ message: "Error occurred" });
   }
});

router.get("/add",(req,res)=>{
   res.render("add_users.ejs",{title: "Add Users"});
})
router.get("/edit/:id", async (req,res)=>{
   let id=req.params.id;
   try{
  const users=await User.findById(id);
  
      if(users==null)
      {
         res.redirect("/");
      }
      else
      {
         res.render("edit_users.ejs",{
            title: "edit user",
            user: users,
         })
      }
   }
   catch(err)
   {
      console.log(err);
      res.redirect("/");
   }
})
// router.post("/update/:id",upload,async (req,res)=>{
//    let id=req.params.id;
//    let new_image="";
//    if(req.file)
//    {
//       new_image=req.file.filename;
   
//    try{
//       fs.unlinkSync("./uploads/"+req.body.old_image);
//    }
//    catch(err){
//       console.log(err);
//    }
// }
// else
// {
//    new_image=req.body.old_image;
//    try{
//   const red=await User.findByIdAndUpdate(id,{
//       name: req.body.name,
//       email:req.body.email,
//       phone:req.body.phone,
//       image:new_image,
//    });
//    res.redirect("/");
//    console.log("update successfully");
// }
// catch(err)
// {
//    console.log("Not updated");
// }
// }
// })
router.post("/update/:id", upload, async (req, res) => {
   let id = req.params.id;
   let new_image = "";

   if (req.file) {
      new_image = req.file.filename;

      try {
         if (req.body.old_image && fs.existsSync("./uploads/" + req.body.old_image)) {
            fs.unlinkSync("./uploads/" + req.body.old_image);
         }
      } catch (err) {
         console.log(err);
      }
   } else {
      new_image = req.body.old_image;
   }

   try {
      const result = await User.findByIdAndUpdate(id, {
         name: req.body.name,
         email: req.body.email,
         phone: req.body.phone,
         image: new_image,
      });

      if (result) {
         console.log("Update successful");
      } else {
         console.log("User not found");
      }

      res.redirect("/");
   } catch (err) {
      console.log("Error updating user:", err);
      res.redirect("/");
   }
});
router.get("/delete/:id", async (req,res)=>{
   let id=req.params.id;
   try{
  const result=await User.findByIdAndRemove(id);
  if(result.image!="")
  {
   try {
      fs.unlinkSync("./uploads/"+result.image);
   } catch (error) {
      console.log(err);
      
   }
  }
  res.redirect("/");
  console.log("User Deleted Suceessfully");
   }
   catch(err)
   {
      console.log(err);
      console.log("not deleted");
   }
})
module.exports=router;