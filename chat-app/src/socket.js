import io from "socket.io-client";

let socket;

const connectSocket = (user_id)=>{
    socket = io("http://localhost:5000",{  //to connect to our server
        query:`user_id=${user_id}`
    });
}

export {socket,connectSocket}