const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

const app = express();
const port = 8000; 
  
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
// initializing the passport data 
app.use(passport.initialize());


// establishing connection 
mongoose.connect(
    `mongodb+srv://AbbasDossa:`+MONGODB_PASSWORD+`@cluster0.uzivkqk.mongodb.net/?retryWrites=true&w=majority`, 
    {
        useNewUrlParser : true , 
        useUnifiedTopology : true , 
    }
).then(()=>{
    console.log(" Connected To Mongo DB");
}).catch((err)=>{
    console.log( "Error Ocurred" , err);
});

 


const User = require("./Models/User");
const Message = require("./Models/Message");


// writing endpointd for user authentication - user registration 
app.post('/register', (req,res)=>{
    // console.log("hell");
    const {name,email,password}= req.body ; 
    const newUser = new User({name,email,password});
    newUser.save().then(()=>{
        res.status(200).json({message: "User Registered Successfully"});
    }).catch((err)=>{
        console.log("Error registering the User",err);
        res.status(500).json({message:"Error registering the User"});
    });
});

// create token function
const createToken =(userId)=>{
    const payload ={
        userId : userId, 
    };

    const token = jwt.sign(payload, "Qsr2K6W8n%cjczwk" , {expiresIn:"1h"});
    return token ;
}

// app.post('/login',(req,res)=>{
//     const {email,password}= req.body;
//     // console.log(email + "    " + password);  -- idhr tak sahi 
//     if ( !email || !password){
//         res.status(404).json({ message:"Email and Password is required "});
//     }
//     User.findOne({email})
//     .then((user)=>{
//         if ( !user){
//             // res.status(404).json({ message:"User not found"});
//             console.log("User not found");
//         }

//         // console.log(user.password +"   this-    ");
//         // console.log(password);
//         if (user.password !== password){
//             // res.status(404).json({ message:" Invalid Password !"});
//             console.log("Invalid Passowrd ");
//         }
//         const token = createToken(user._id);
//         res.status(200).json({token});
//     })
//     .catch((error)=>{
//         console.log("error in finding the user ", error);
//         res.status(500).json({ message:"Internal Server Error "});
//     });

// });

app.post('/login', async (req, res) => {
    try {
    // const email="Saba@gmail.com";
    // const password ="12345";      
      const {  email,password } = req.body;
    
      if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
      }
  
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }
  
      
    //   console.log(password + "" + user.password);
      if (password !== user.password) {
        console.log("Invalid Password");
        return res.status(401).json({ message: "Invalid Password" });
      }
  
      const token = createToken(user._id);
      return res.status(200).json({ token });
    } catch (error) {
      console.log("Error in finding the user or comparing passwords", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });


app.get("/testing",(req,res)=>{
    res.status(200).json({message:"Succesffull test"});
})


// endpoint -> which display all the users that are registered on this App - except the one registered ofcourse
app.get("/users/:userId" , (req,res)=>{
    const loggedInUserId = req.params.userId;
    // console.log(" This is the user logged in -  "+loggedInUserId);
    User.find({_id:{$ne:loggedInUserId}})
    .then((users)=>{
        res.status(200).json(users);
    })
    .catch((error)=>{
        console.log("Error Fetching the users - " , error);
        res.status(500).json({ message:"Error Retrieving the users"});

    });
    // res.status(500).json({ message:"Error Retrieving the users"});
});


// endpoint to send a request to a user - 
app.post('/friendRequest', async (req,res)=>{
    const {currentUserId , selectedUserId}= req.body ;

    try{
        // update the recepnts friemd request array 
        await User.findByIdAndUpdate(selectedUserId,{
            $push:{
                friendRequests: currentUserId
            }
        });

        // update senders sent friend request array 
        await User.findByIdAndUpdate(currentUserId, {
            $push:{
                sentFriendRequests: selectedUserId
            }
        });

        res.status(200);
    }
    catch (error){
        conosle.log(error);
        res.status(500);
    }
});

// endpoint to show all the friend request of a particulara user 
app.get('/friendRequest/:userId', async (req,res)=>{
    try{
        const {userId} = req.params;

        // fetch the user focument absed on the user id 
        const user = await User.findById(userId).populate("friendRequests","name email").lean();
        const friendRequests = user.friendRequests;
        res.json(friendRequests);
    }
    catch (error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
});

app.post("/friendRequest/accept", async (req,res)=>{
    
    try{
        const {senderId , receipntId }= req.body ;

        // retreve sender documents and receipnts 
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receipntId);

        sender.friends.push(receipntId);
        receiver.friends.push(senderId);

        receiver.friendRequests = receiver.friendRequests.filter(
            (request)=> request.toString() !== senderId.toString()
        );

        sender.sentFriendRequests = sender.sentFriendRequests.filter(
            (request)=> request.toString() !== receipntId.toString()
        );

        await sender.save();
        await receiver.save();

        res.status(200).json({ message:"Friend Request Accepted Successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message:" Internal Server Error "});
    }

});


// emndpoint to access all the fireinds of the login user 
app.get("/acceptedFriends/:userId" ,async  (req,res)=>{

    try{
        const {userId} = req.params;
        const user = await User.findById(userId).populate(
            "friends",
            "name email",
        );

        const acceptedFriends = user.friends;
        res.json(acceptedFriends);

    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Serval Error "});
    }
});


const storage =multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'uploads/');  // desired destination folder 
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000 );
        cb(null,uniqueSuffix + '-' + file.originalname);

    },
});

const upload = multer({ storage:storage});

// end point to post messages and store it in the backend 
app.post("/Messages", upload.single("imageFile"), async (req,res)=>{
    try{
        const {senderId,receipntId,messageType,messageText} = req.body;

        const newMessage = new Message ({
            senderId,
            receipntId,
            messageType,
            message:messageText,
            timeStamp: new Date(),
            imageUrl:messageType==="image" ? req.file.path : null,
        });

        await newMessage.save();
        console.log("Message sent !");
        res.status(200).json({message:"Message Sent Successfully"});
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message:"Internal Server Error "});
    }
});


// endpoint to get the suer details - to design the chat room header 
app.get("/user/:userId",async (req,res)=>{
    try{
        const {userId} = req.params;

        // fetch user data from the userId
        const receipntId = await User.findById(userId);
        console.log(receipntId);
        res.json(receipntId);
    }   
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error "});
    }
});


// endpoint to fetch the messages between two users in the chat room 
app.get("/Messages/:senderId/:receipntId",  async (req,res)=>{
    try {
        const {senderId , receipntId}= req.params ;
        const messages= await Message.find({
            $or:[
                {senderId:senderId, receipntId:receipntId},
                {senderId:receipntId, receipntId:senderId},
            ]
        }).populate("senderId" , "_id name");
        
        res.json(messages);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"Internal Server Error "});
    }
});



// end point to delete the emessage s
app.post("/deleteMessages",async  (req,res)=>{
    try{
        const {messages}=req.body ;
        console.log("Messages To be Deleted : ",messages);
        if ( messages.length === 0 ){
            return res.status(400).json({message:"Invalid Request Body"});
        }

        await Message.deleteMany({_id:{$in:messages}});
        res.json({message:"Message Deleted Successfully "});
    }
    catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
});



app.listen(port,()=>{
    console.log("Server Running On Port 8000");
});

