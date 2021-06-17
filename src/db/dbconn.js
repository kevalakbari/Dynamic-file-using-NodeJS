const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/DanceRegistration", {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then(() => {
    console.log("database connection successful");
}).catch((err)=> {
    console.log(err);
})