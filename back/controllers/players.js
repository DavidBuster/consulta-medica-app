const bcrypt = require("bcrypt");
const playersRouter = require("express").Router();
const Player = require("../models/player");

playersRouter.get("/", async (request, response) => {
  const players = await Player.find({});

  console.log("PLAT", players, typeof players);

  response.json({ list: players });
});

playersRouter.post("/", async (request, response) => {
  const { firstName, lastName } = request.body;

  // const saltRounds = 10;
  // const passwordHash = await bcrypt.hash(password, saltRounds);

  const player = new Player({
    firstName,
    lastName,
    // passwordHash,
  });

  const savedPlayer = await player.save();

  response.status(201).json(savedPlayer);
});

module.exports = playersRouter;
