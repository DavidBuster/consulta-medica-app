const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // this ensures the uniqueness of username
  },
  name: String,
  //   passwordHash: String,
  prefPlayers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
});

playerSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    // delete returnedObject.passwordHash;
  },
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
