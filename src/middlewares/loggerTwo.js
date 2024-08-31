const loggerTwo = (request, response, next) => {
  console.log("log 2");
  next();
};

module.exports = loggerTwo;
