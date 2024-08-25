const logger = (request, response, next) => {
    console.log("log");
    next();
  };
  
  module.exports = logger;
  