const mongoose = require("mongoose");

//the address to our mongoDB
const mongoUri = 'mongodb+srv://admin:admin@cluster.eghkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
//mongoose is our way to comunicate with mongo
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
});

mongoose.connection
    .once("open",()=>console.log("we are connected"))
    .on("error",(error)=>{
        console.warn("An error occured", error)
    })

