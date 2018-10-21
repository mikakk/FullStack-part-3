const mongoose = require("mongoose");

console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
if (process.env.NODE_ENV !== "production") {
    console.log("development");
    require("dotenv").config();
} else {
    console.log("production");
}

console.log("process.env.MONGODB_URI:", process.env.MONGODB_URI);
const url = process.env.MONGODB_URI;

mongoose.connect(
    url,
    { useNewUrlParser: true }
);

const Person = getPersonModel();

function getPersonModel() {
    return mongoose.model("Person", {
        name: String,
        phone: String
    });
}

module.exports = Person;
