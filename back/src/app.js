const path = require("path");
const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/auth", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);

// Middleware para manejar rutas del frontend (para SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
