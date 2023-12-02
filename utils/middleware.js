const logger = require("./logger");

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

const errorHandler = (error, request, response, next) => {
    console.log("Middleware Error Handling");
    const errorStatus = error.statusCode || 500;
    const errorMessage = error.message || 'Something went wrong';
    response.status(errorStatus).send({
        success: false,
        status: errorStatus,
        message: errorMessage,
    })
}
module.exports = {
    requestLogger,
    errorHandler
};