const validator = require("validator");
const Article = require('../models/Article');

const ArticleController = {

    create: (req, res) => {

        let {title, content} = req.body;

        try{
            let validate_title = validator.isEmpty(title) || !validator.isLength(title, {min: 5, max: 50});
            let validate_content = validator.isEmpty(content);

            if(validate_title  || validate_content){
               throw new Error("Validation error");
            }

            const article = new Article({title, content});
            article.save((err, savedArticle) => {
                if(err || !savedArticle){
                    return res.status(400).json({
                        status: "error",
                        message: "An error occurred saving de data."
                    });
                }
                return res.status(200).json({
                    status: 200,
                    message: "success",
                    article: savedArticle
                });
            })     
        }catch(err){
            return res.status(400).json({
                status: "error",
                message: "An error occurred in validation"
            });
        }   
    },
    getArticles: (req, res) => {

        let query = Article.find({});
        let last = req.params.last;

        if(last){
            if(!parseInt(last)){
                return res.status(400).json({
                    status: "error",
                    message: last
                })
            }
            query.limit(last);
        }
            query.sort({date: -1})
                 .exec((err, articles) => {
            if(err || !articles){
                return res.status(400).json({
                    status: "error",
                    message: "Articles not found."
                })
            }
            console.log(articles);
            return res.status(200).json({
                status: 200,
                message: "success",
                articles,
                last
            });
        });
    }
}

module.exports = ArticleController;