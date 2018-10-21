const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const Person = require("./models/person");
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("build"));

morgan.token("type", function(req, res) {
    return req.headers["content-type"];
});

morgan.token("data", function(req, res) {
    return JSON.stringify(req.body);
});

app.use(
    morgan(
        ":method :type :url :data :status :res[content-length] - :response-time ms"
    )
);

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

const formatPerson = person => {
    return {
        name: person.name,
        phone: person.phone,
        id: person._id
    };
};

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
    Person.find({}, { __v: 0 })
        .then(persons => {
            res.json(persons.map(formatPerson));
        })
        .catch(error => {
            console.log(error);
        });
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
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end();
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ error: "malformatted id" });
        });
});

const generateId = () => {
    return Math.floor(Math.random() * Math.floor(999999999));
};

app.post("/api/persons", (req, res) => {
    const body = req.body;
    if (body.name === undefined) {
        return res.status(400).json({ error: "name missing" });
    }
    if (body.phone === undefined) {
        return res.status(400).json({ error: "phone missing" });
    }

    const person = new Person({
        name: body.name,
        phone: body.phone,
        id: generateId()
    });
    person
        .save()
        .then(savedPerson => {
            res.json(formatPerson(savedPerson));
        })
        .catch(error => {
            console.log(error);
        });

    /*const contains = persons.filter(person => person.name === body.name);
    if (contains.length) {
        return res.status(400).json({ error: "name must be unique" });
    }
    const person = {
        name: body.name,
        phone: body.phone,
        id: generateId()
    };
    persons = persons.concat(person);
    res.json(person);*/
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
