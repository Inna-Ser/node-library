const fs = require("fs");
const path = require("path");

const getUsers = () => {
  const filePath = path.join(__dirname, "../data/users.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const getBooks = () => {
  const filePath = path.join(__dirname, "../data/books.json");
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
};

const saveUsers = (users) => {
  const filePath = path.join(__dirname, "../data/users.json");
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
};

const addBookToUser = (userId, bookId) => {
  const books = getBooks();
  const users = getUsers();

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
  const books = getBooks();
  const users = getUsers();

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
  saveUsers,
  addBookToUser,
  delBookFromUser,
};
