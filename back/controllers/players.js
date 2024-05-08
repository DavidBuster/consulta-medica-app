const bcrypt = require("bcrypt");
const playersRouter = require("express").Router();
const Player = require("../models/player");

playersRouter.get("/", async (request, response) => {
  const players = await Player.find({}).populate("notes", {
    content: 1,
    important: 1,
  });
  response.json(players);
});

playersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const player = new Player({
    username,
    name,
    passwordHash,
  });

  const savedPlayer = await player.save();

  response.status(201).json(savedPlayer);
});

module.exports = playersRouter;
