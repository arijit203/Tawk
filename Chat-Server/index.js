const app=require("./app");
const mongoose=require("mongoose");
const http = require("http");

const path=require("path")

const server=http.createServer(app);

const {Server}=require("socket.io");

const dotenv = require('dotenv');
const User = require("./models/user");
const FriendRequest = require("./models/friendRequest");
const OneToOneMessage = require("./models/OneToOneMessage");
dotenv.config({path: './config.env'});

const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

process.on("uncaughtException",(err)=>{
    console.log(err);
    process.exit(1);
})


const port=process.env.port || 3000 ;


mongoose.connect( process.env.MONGO_CONN ).then(()=>{
    console.log("Connection established");
}).catch((err)=>{
    console.log(err)
})




server.listen(port,()=>{
    console.log("Listening on port ", port)
})

io.on("connection",async(socket)=>{
    // console.log("Connection:",JSON.stringify(socket.handshake.query));
    const user_id=socket.handshake.query["user_id"];
    
    const socket_id=socket.id;

    // console.log("user connected",socket_id)

    if(user_id){
        await User.findByIdAndUpdate(user_id,{socket_id,status:"Online"});
    }

    //Socket Event Listeners....

    //create a friend request


    socket.on("friend_request",async (data)=>{
        // console.log(data.to);

        //data=>{to,from}

        //{to:"user_id"}
        const to_user=await User.findById(data.to).select("socket_id");
        const from_user=await User.findById(data.from).select("socket_id");

        await FriendRequest.create({

            sender:data.from,
            recipient:data.to,
        })

        //emit =>"new_friend_request"
        io.to(to_user?.socket_id).emit("new_friend_request",{

            message:"New Friend Request Received"
        });

        io.to(from_user?.socket_id).emit("request_sent",{
            message:"Request sent Successfully!"
        })

    })

    socket.on("accept_request",async(data)=>{
        // console.log(data)

        const request_doc=await FriendRequest.findById(data.request_id);

        // console.log("Accept Request:",request_doc);

        const sender=await User.findById(request_doc.sender);
        console.log(sender)

        const  recipient=await User.findById(request_doc.recipient);

        sender.friends.push(request_doc.recipient);
        recipient.friends.push(request_doc.sender);

        await recipient.save({new:true,validateModifiedOnly:true});
        await sender.save({new:true,validateModifiedOnly:true});

        await FriendRequest.findByIdAndDelete(data.request_id);

        io.to(sender?.socket_id).emit("request_accepted",{
            message:"Friend Request Accepted"
        });

        io.to(recipient?.socket_id).emit("request_accepted", {
            message: "Friend Request Accepted",
          });

    });

    socket.on("get_direct_conversation",async({user_id},callback)=>{
        const existing_conversations=await OneToOneMessage.find({
            participants:{$all:[user_id]}
        }).populate("participants","firstName lastName _id email status");

        callback(existing_conversations)
    });

    socket.on("start_conversation",async(data)=>{
        const {to,from}=data;

        //check id there is a prexisting conversation between the users
        const existing_conversations=await OneToOneMessage.find({
            participants:{size:2,$all:[to,from]}
        }).populate("participants","firstName lastName email _id status");

        console.log(existing_conversations[0],"Existing Conversation");

        //if no existing conversation
        if(existing_conversations.length===0){
            let new_chat=await OneToOneMessage.create({
                participants:[to,from]
            })

            new_chat=await OneToOneMessage.find(new_chat._id).populate("participants","firstName lastName email _id status");
            
            socket.emit("start_chat",new_chat); //pass new_chat as the payload
        }


        //if there is existing conversation
        else{
            socket.emit("open_chat",existing_conversations[0])
        }
    })

    //Handle text/Link message
    socket.on("text_message",(data)=>{
        console.log("Received Message",data);

        //data:{to,from,text}
        //create a new conversation if it doesn't exist or add new messages to existing list

        //save to db

        //emit incoming_message -> to user

        //emit outgoing_message -> from user

        
    })

    socket.on("file_message",(data)=>{
        console.log("Received Message",data);

        //data:{to,from,text,file}

        //get the file extension

        const fileExtension=path.extname(data.file.name);

        //generate a unique file name

        const fileName=`${Date.now()}_${Math.floor(Math.random()*10000)}${fileExtension}`;

        //Upload the file to db

        //emit incoming_message -> to user

        //emit outgoing_message -> from user
        
        
    })

    socket.on("end",async function(data){
        //Find user by _id and set the status to offline

        if(data.user_id){
            await User.findByIdAndUpdate(data.user_id,{status:"Offline"});
        }
        console.log("Closing Socket connection");
        socket.disconnect(0);
    })

});

