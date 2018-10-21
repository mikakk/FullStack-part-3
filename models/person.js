const mongoose = require("mongoose");

const url =
    "mongodb://" +
    readCredentials() +
    "@ds137643.mlab.com:37643/fullstack-part-3";

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

function readCredentials() {
    const fs = require("fs");
    const path = __dirname + "\\..\\mongo_credentials.txt";
    return fs.readFileSync(path);
}

module.exports = Person;
