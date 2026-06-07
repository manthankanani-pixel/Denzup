const mongoose = require("mongoose");

mongoose.connect(
    "mongodb+srv://danzupadmin:YOUR_PASSWORD@cluster0.39nxsyr.mongodb.net/danzup"
)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });