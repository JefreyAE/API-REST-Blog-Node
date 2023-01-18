const mongoose = require("mongoose");

const connection = async () => {

    try{
        mongoose.set('strictQuery', false);
        await mongoose.connect("mongodb://localhost:27017/db_blog");

        console.log("Succesfully connected to the database: localhost:27017/db_blog");
    }catch(err){
        console.log(error);
        throw new Error("Error trying to connect the database.");
    }
}

module.exports = {
    connection
}