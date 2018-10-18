const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("build"));

morgan.token("type", function(req, res) {
    return req.headers["content-type"];
});

morgan.token("data", function(req, res) {
    return JSON.stringify(req.body);
});

//app.use(morgan("tiny")); // GET /api/persons 200 179 - 3.632 ms
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
    const contains = persons.filter(person => person.name === body.name);
    if (contains.length) {
        return res.status(400).json({ error: "name must be unique" });
    }
    const person = {
        name: body.name,
        phone: body.phone,
        id: generateId()
    };
    persons = persons.concat(person);
    //res.json(persons);
    res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
