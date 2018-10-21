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

const formatPerson = person => {
    return {
        name: person.name,
        phone: person.phone,
        id: person._id
    };
};

app.get("/info", (req, res) => {
    Person.countDocuments({})
        .then(count => {
            res.send(
                "<p>puhelinluettelossa " +
                    count +
                    " henkilön tiedot</p>" +
                    "<p>" +
                    new Date().toString() +
                    "</p>"
            );
        })
        .catch(error => {
            console.log(error);
        });
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
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(formatPerson(person));
            } else {
                res.status(404).end();
            }
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ error: "malformatted id" });
        });
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

    Person.find({ name: body.name })
        .then(result => {
            if (result.length > 0) {
                return Promise.reject("duplicate");
            }
        })
        .then(() => {
            const person = new Person({
                name: body.name,
                phone: body.phone
            });
            person
                .save()
                .then(savedPerson => {
                    res.json(formatPerson(savedPerson));
                })
                .catch(error => {
                    console.log(error);
                });
        })
        .catch(error => {
            console.log(error);
            if (error == "duplicate") {
                res.status(400).send({ error: "name must be unique" });
            } else {
                res.status(400).send({ error: "malformatted id" });
            }
        });
});

app.put("/api/persons/:id", (req, res) => {
    const body = req.body;

    const person = {
        name: body.name,
        phone: body.phone
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(formatPerson(updatedPerson));
        })
        .catch(error => {
            console.log(error);
            res.status(400).send({ error: "malformatted id" });
        });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
