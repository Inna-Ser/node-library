const http = require("http");
const { getUsers, getBooks } = require("./modules/library");


const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:3002`);

  const isUsersExist = url.searchParams.has("users");
  const isBooksExist = url.searchParams.has("books");

  if(request.url === "/") {
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.setHeader("Content-Type", "text/plain");
    response.end("Hello, world!");
    return;
  }

  if (isUsersExist) {
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.setHeader("Content-Type", "application/json");
    response.end(getUsers());
    return;
  }

  if (isBooksExist) {
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.setHeader("Content-Type", "application/json");
    response.end(getBooks());
    return;
  }
});

server.listen(3002, () => {
  console.log("Сервер запущен по адресу http://127.0.0.1:3002");
});
