const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const logger = require("./middlewares/logger");

dotenv.config();

const app = express();

app.use(logger); // Логгер для всех маршрутов

const {
  PORT = 3000,
  API_URL = "http://127.0.0.1",
  MONGO_URL = "mongodb://localhost:27017/backend",
} = process.env;

app.use(cors());
app.use(bodyParser.json());

const helloWorld = (request, response) => {
  response.status(200);
  response.send("Hello, World!");
};

app.get("/", helloWorld);

app.post("/", (request, response) => {
  response.status(200);
  response.send("Hello from post");
});

app.use("/users", userRouter);
app.use("/books", bookRouter);

// Обработка несуществующих маршрутов
app.use((request, response, next) => {
  response.status(404).send("Route not found");
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Успешно подключено к MongoDB");
  })
  .catch((err) => {
    console.error("Ошибка подключения к MongoDB:", err);
  });

app.listen(PORT, () => {
  console.log(`Сервер запущен по адресу ${API_URL}:${PORT}`);
});
