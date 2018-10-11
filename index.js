const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

let persons = [
    {
        name: "First Last",
        phone: "5 55555",
        id: 1
    },
    {
        name: "User User",
        phone: "050-12345",
        id: 2
    },
    {
        name: "werwer",
        phone: "323",
        id: 4
    },
    {
        name: "sddss",
        phone: "123",
        id: "sddss"
    }
];

app.get("/info", (req, res) => {
    res.send(
        "<p>puhelinluettelossa " +
            persons.length +
            " henkilön tiedot</p>" +
            "<p>" +
            new Date().toString() +
            "</p>"
    );
});

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    person = persons.filter(person => person.id !== id);
    res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
