const fs = require("fs");
const path = require("path");

const getUsers = () => {
  const filePath = path.join(__dirname, "../data/users.json");
  return fs.readFileSync(filePath, "utf-8");
};

const getBooks = () => {
  const filePath = path.join(__dirname, "../data/books.json");
  return fs.readFileSync(filePath, "utf-8");
};

const getBook = (bookId) => {
  const books = getBooks();
  return books.find((book) => book.id === bookId);
};

const saveUsers = (users) => {
  const filePath = path.join(__dirname, "../data/users.json");
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
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
};
