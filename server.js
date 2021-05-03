require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const helmet = require('helmet')
const POKEDEX = require("./pokedex.json");

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log("validate bearer token middleware");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
});

const validTypes = [
  `Bug`,
  `Dark`,
  `Dragon`,
  `Electric`,
  `Fairy`,
  `Fighting`,
  `Fire`,
  `Flying`,
  `Ghost`,
  `Grass`,
  `Ground`,
  `Ice`,
  `Normal`,
  `Poison`,
  `Psychic`,
  `Rock`,
  `Steel`,
  `Water`,
];

function handleGetTypes(req, res) {
  res.json(validTypes);
}

app.get("/types", handleGetTypes);

function handleGetPokemon(req, res) {
  //res.send("Hello, Pokemon!");
  const name = req.query.name.toLowerCase();
  const type = req.query.type.toLowerCase();
  let result = POKEDEX.pokemon;
  if (type) {
    if (!validTypes.map((t) => t.toLowerCase()).includes(type)) {
      return res.send("Invalid type. Valid types are " + validTypes.join());
    }
    result = result.filter((item) =>
      item.type.map((t) => t.toLowerCase()).includes(type)
    );
  }

  if (name) {
    result = result.filter(
      (item) => item.name.toLowerCase().indexOf(name) >= 0
    );
  }

  res.json(result);
}

app.get("/pokemon", handleGetPokemon);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
