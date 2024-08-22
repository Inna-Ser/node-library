const http = require("http");
const path = require("path");
const fs = require("fs");

const getUsers = () => {
  const filePath = path.join(__dirname, "../data/users.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

const getBooks = () => {
  const filePath = path.join(__dirname, "../data/books.json");
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};
const getBookForUser = (userId, bookId) => {
  const users = JSON.parse(getUsers());
  const books = JSON.parse(getBooks());

  const user = users.find((user) => user.id === userId);
  if (!user) {
    throw new Error("Пользователь не найден");
  }

  const userBooks = books.filter((book) => user.books.includes(book.id));
  const userBook = userBooks.find((book) => book.id === bookId);
  return userBook;
};

const getBook = (bookId) => {
  const books = getBooks();
  return books.find((book) => book.id === bookId);
};

const saveUsers = (users) => {
  const filePath = path.join(__dirname, "../data/users.json");
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
};

const saveBooks = (books) => {
  const filePath = path.join(__dirname, "../data/books.json");
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2), "utf-8");
};

const changeDataBooks = (bookId, newBookData) => {
  const books = JSON.parse(getBooks());
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    throw new Error("Книга не найдена");
  }
  books[bookIndex] = { ...books[bookIndex], ...newBookData };
  saveBooks(books);
};

const addBookToUser = (userId, bookId) => {
  const books = JSON.parse(getBooks());
  const users = JSON.parse(getUsers());

  const user = users.find((user) => user.id === userId);
  const book = books.find((book) => book.id === bookId);

  if (!user || !book) {
    throw new Error("Читатель или книга не найдены.");
  }
  if (!user.books.includes(bookId)) {
    user.books.push(bookId);
    saveUsers(users);
  }
};

const delBookFromUser = (userId, bookId) => {
  const books = JSON.parse(getBooks());
  const users = JSON.parse(getUsers());

  const user = users.find((user) => user.id === userId);
  const book = books.find((book) => book.id === bookId);

  if (!user || !book) {
    throw new Error("Читатель или книга не найдены.");
  }
  if (user.books.includes(bookId)) {
    user.books = user.books.filter((id) => id !== bookId);
    saveUsers(users);
  }
};

module.exports = {
  getUsers,
  getBooks,
  getBook,
  saveUsers,
  addBookToUser,
  delBookFromUser,
  getBookForUser,
  changeDataBooks,
};
