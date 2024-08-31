const loggerOne = (request, response, next) => {
  console.log("log 1");
  next();
};

module.exports = loggerOne;
