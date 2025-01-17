
import dotenv from "dotenv";
// import { DB_NAME } from "./constants.js";

import mongoose from "mongoose";
import {app} from "./app.js";

import connectDB from "./db/index.js";

dotenv.config({
    path:'./.env'
})

connectDB().then(()=>{

    app.on("error",(error)=>{
                    console.log("ERRR",error);
                    throw error;
                });

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
}

).catch((err)=>{
  console.log("Mongo DB connection failed !!",err);
})


// const conn=async ()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error",(error)=>{
//             console.log("ERRR",error);
//             throw error;
//         });
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("ERROR:",error)
//         throw error;
//     }

// };

// conn()