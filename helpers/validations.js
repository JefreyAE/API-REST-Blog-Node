const validator = require("validator");

const validateArticle = (parameters) => {

    let validate_title = validator.isEmpty(parameters.title) || !validator.isLength(parameters.title, {min: 3, max: 70});
    let validate_content = validator.isEmpty(parameters.content);

    if(validate_title  || validate_content){
        throw new Error("Validation error");
    }
}

module.exports = {
    validateArticle
}