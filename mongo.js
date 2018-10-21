/* 
node mongo.js
node mongo.js name 123
*/

const mongoose = require("mongoose");

if (process.argv.length != 2 && process.argv.length != 4) {
    console.log("väärät parametrit");
    return;
}

console.log("process.env.NODE_ENV:", process.env.NODE_ENV);
console.log("process.env.MONGODB_URI:", process.env.MONGODB_URI);
if (process.env.NODE_ENV !== "production") {
    console.log("development");
    require("dotenv").config();
} else {
    console.log("production");
}

const url = process.env.MONGODB_URI;
console.log("url:", url);

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
        phone: process.argv[3]
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
        phone: String
    });
}
