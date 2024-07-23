const http = require("http");
const {
  getUsers,
  getBooks,
  saveUsers,
  addBookToUser,
  delBookFromUser,
  getBook,
} = require("./modules/library");

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:3002`);

  const isUsersExist = url.searchParams.has("users");
  const isBooksExist = url.searchParams.has("books");

  if (request.url === "/") {
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.setHeader("Content-Type", "text/plain");
    response.end("Hello, world!");
    return;
  }

  if (url.pathname.match(/^\/books\/\d+$/)) {
    const bookId = parseInt(url.pathname.split("/")[2], 10);
    try {
      const book = getBook(bookId);

      if (!book) {
        response.statusCode = 404;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: "Книга не найдена" }));
        return;
      }

      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(book));
    } catch (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({ error: "Ошибка сервера при получении книги" })
      );
    }
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

  if (request.url.startsWith("/users/") && request.url.endsWith("/books")) {
    const userId = parseInt(url.pathname.split("/")[2], 10); // Извлечение userId из URL
    const users = JSON.parse(getUsers());
    const books = JSON.parse(getBooks());

    const user = users.find((user) => user.id === userId);

    if (!user) {
      response.statusCode = 404;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "Пользователь не найден" }));
      return;
    }

    const userBooks = books.filter((book) => user.books.includes(book.id));
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(userBooks));
    return;
  }

  if (
    request.method === "POST" &&
    url.pathname.startsWith("/users/") &&
    url.pathname.endsWith("/books")
  ) {
    const pathnameParts = url.pathname.split("/");
    const userId = parseInt(pathnameParts[2], 10);

    let body = "";

    request.on("data", (chunk) => {
      body += chunk.toString();
    });

    request.on("end", () => {
      try {
        const { bookId } = JSON.parse(body);

        addBookToUser(userId, bookId);

        response.statusCode = 200;
        response.statusMessage = "OK";
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ message: "Книга успешно добавлена!" }));
      } catch (error) {
        response.statusCode = 400;
        response.statusMessage = "Bad Request";
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  if (
    request.method === "DELETE" &&
    url.pathname.startsWith("/users/") &&
    url.pathname.endsWith("/books")
  ) {
    const pathnameParts = url.pathname.split("/");
    const userId = parseInt(pathnameParts[2], 10);
    const queryParams = new URLSearchParams(url.search);
    const bookId = queryParams.get("bookId");

    if (!bookId) {
      response.statusCode = 400;
      response.statusMessage = "Bad Request";
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "bookId не указан" }));
      return;
    }
    try {
      delBookFromUser(userId, bookId);

      response.statusCode = 200;
      response.statusMessage = "OK";
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ message: "Книга успешно удалена!" }));
    } catch (error) {
      response.statusCode = 400;
      response.statusMessage = "Bad Request";
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: error.message }));
    }
    return;
  }

  response.statusCode = 404;
  response.setHeader("Content-Type", "text/plain");
  response.end("404 Not Found");
});

server.listen(3002, () => {
  console.log("Сервер запущен по адресу http://127.0.0.1:3002");
});
