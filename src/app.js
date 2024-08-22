const http = require("http");
const { getUsers, getBooks } = require("./modules/library");

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:3002`);
  const pathname = url.pathname;

  if (pathname === "/") {
    response.statusCode = 200;
    response.statusMessage = "OK";
    response.setHeader("Content-Type", "text/plain");
    response.end("Hello, world!");
    return;
  }

  if (request.method === "GET" && pathname === "/users") {
    try {
      const users = JSON.parse(getUsers());
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(users.JSON));
    } catch (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({ error: "Ошибка сервера при получении пользователей" })
      );
    }
    return;
  }

  if (request.method === "GET" && pathname === "/books") {
    try {
      const users = JSON.parse(getBooks());
      response.statusCode = 200;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(books.JSON));
    } catch (error) {
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({ error: "Ошибка сервера при получении пользователей" })
      );
    }
    return;
  }

  if (
    request.method === "GET" &&
    pathname.startsWith("/users/") &&
    pathname.includes("/books/")
  ) {
    const parts = pathname.split("/");
    const userId = parseInt(parts[2], 10);
    const bookId = parseInt(parts[4], 10);

    if (isNaN(userId) || isNaN(bookId)) {
      response.statusCode = 400;
      response.setHeader("Content-Type", "application/jsonx");
      response.end(JSON.stringify({ error: "Некорректный userId или bookId" }));
      return;
    }
    try {
      const book = getBookForUser(bookId, userId);

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

  if (
    request.method === "POST" &&
    pathname.startsWith("/users/") &&
    pathname.includes("/books/")
  ) {
    const parts = pathname.split("/");
    const userId = parseInt(parts[2], 10);
    const bookId = parseInt(parts[4], 10);
    if (isNaN(userId) || isNaN(bookId)) {
      response.statusCode = 400;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "Некорректный userId или bookId" }));
      return;
    }
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", async () => {
      try {
        await addBookToUser(userId, bookId);
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
    pathname.startsWith("/users/") &&
    pathname.includes("/books/")
  ) {
    const parts = pathname.split("/");
    const userId = parseInt(parts[2], 10);
    const bookId = parseInt(parts[4], 10);

    if (isNaN(userId) || isNaN(bookId)) {
      response.statusCode = 400;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "Некорректный userId или bookId" }));
      return;
    }
    try {
      await delBookFromUser(userId, bookId);
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

  if (request.method === "PUT" && pathname.startsWith("/books/")) {
    const parts = pathname.split("/");
    const bookId = parseInt(parts[2], 10);
    if (isNaN(bookId)) {
      response.statusCode = 400;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "Некорректный bookId" }));
      return;
    }
    let body = "";
    request.on("data", (chunk) => {
      body += chunk.toString();
    });
    request.on("end", async () => {
      try {
        const newBookData = JSON.parse(body);
        await changeDataBooks(bookId, newBookData);
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.setHeader("Content-Type", "application/json");
        response.end(
          JSON.stringify({ message: "Данные книги успешно изменены" })
        );
      } catch (error) {
        response.statusCode = 500;
        response.statusMessage = "Internal Server Error";
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify({ error: "Ошибка сервера" }));
      }
    });
    return;
  }

  response.statusCode = 404;
  response.setHeader("Content-Type", "text/plain");
  response.end("404 Not Found");
});

server.listen(3002, () => {
  console.log("Сервер запущен на порту 3002");
});
