const mongoose = require("mongoose");

if (process.argv.length != 2 && process.argv.length != 4) {
    console.log("väärät paremetrit");
    return;
}

const url =
    "mongodb://" +
    readCredentials() +
    "@ds137643.mlab.com:37643/fullstack-part-3";

mongoose.connect(
    url,
    { useNewUrlParser: true }
);

if (process.argv.length == 2) {
    listPersons();
} else {
    addNewPerson();
}

function listPersons() {
    console.log("puhelinluettelo:");
    const Person = getPersonModel();
    Person.find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.phone);
            });
            mongoose.connection.close();
        })
        .catch(error => {
            console.log(error);
        });
}

function addNewPerson() {
    const Person = getPersonModel();
    console.log(
        "lisätään henkilö",
        process.argv[2],
        "numero",
        process.argv[3],
        "luetteloon"
    );
    const person = new Person({
        name: process.argv[2],
        phone: process.argv[3],
        id: generateId()
    });

    person
        .save()
        .then(response => {
            console.log("tallentaminen onnistui");
            mongoose.connection.close();
        })
        .catch(error => {
            console.log(error);
        });
}

function getPersonModel() {
    return mongoose.model("Person", {
        name: String,
        phone: String,
        id: String
    });
}

function readCredentials() {
    var fs = require("fs");
    return fs.readFileSync(__dirname + "\\mongo_credentials.txt");
}

function generateId() {
    return Math.floor(Math.random() * Math.floor(999999999));
}
