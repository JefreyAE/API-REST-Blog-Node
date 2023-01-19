const fs = require("fs");
const Article = require('../models/Article');
const { validateArticle } = require( "../helpers/validations");
const path = require("path");

const ArticleController = {

    create: (req, res) => {

        let {title, content} = req.body;

        try{
            validateArticle(req.body);
        }catch(err){
            return res.status(400).json({
                status: "error",
                message: "An error occurred in validation"
            });
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
        
    },
    getArticles: (req, res) => {

        let query = Article.find({});
        let last = req.params.last;

        if(last){
            if(!parseInt(last)){
                return res.status(400).json({
                    status: "error",
                    message: "The parameter is invalid"
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
            return res.status(200).json({
                status: "success",
                message: "Articles found.",
                articles
            });
        });
    },
    getArticle: (req, res) => {

        let id = req.params.id;

        Article.findById(id, (err, article) => {
            if(err || !article){
                return res.status(404).json({
                    status: "error",
                    message: "Article not found."
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Article found",
                article
            });
        });
    },
    delete: (req, res) => {

        let id = req.params.id;
       
        validateId(id);

        Article.findOneAndDelete({_id: id}, (err, article) => {
            if(err || !article){
                return res.status(404).json({
                    status: "error",
                    message: "Article not found."
                })
            }

            return res.status(200).json({
                status: "success",
                message: "Article deleted",
                article
            });
        });
    },
    update: (req, res) => {

        let parameters = req.body;
        let id = req.params.id;
       
        try{
            validateArticle(req.body);
        }catch(err){
            return res.status(400).json({
                status: "error",
                message: "An error occurred in validation"
            });
        }   

        Article.findOneAndUpdate({_id: id}, parameters, {new: true}, (err, article) => {
            if(err || !article){
                return res.status(500).json({
                    status: "error",
                    message: "Article not updated."
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Article updated",
                article
            });
        });  
    },
    uploadImage: (req, res) => {

        if(!req.file && !req.files){
            return res.status(404).json({
                status: "error",
                message: "Invalid request"
            });
        }

        let fileName = req.file.originalname;
        let extension = fileName.split("\.")[1];

        if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){
            fs.unlink(req.file.path, (err) => {
                return res.status(400).json({
                    status: 'error',
                    message: "Invalid image"
                })
            })
        }else{

            let id = req.params.id;
            Article.findOneAndUpdate({_id: id}, {image: req.file.filename}, {new: true}, (err, article) => {
                if(err || !article){
                    return res.status(500).json({
                        status: "error",
                        message: "Article not updated."
                    });
                }
    
                return res.status(200).json({
                    status: "success",
                    message: "Article updated",
                    article
                });
            });  
        }  
    },
    getImage: (req, res) => {
        let fileName = req.params.file;
        let path_image = "./images/articles/"+fileName;

        try{
            fs.stat(path_image, (err, exists) => {
                if(exists){
                    return res.sendFile(path.resolve(path_image));
                }else{
                    if(err){
                        return res.status(404).send({
                            status: "error",
                            message: err.message
                        })
                    }else{
                        return res.status(404).send({
                            status: "error",
                            message: "Image not found."
                        })
                    }
                }
            });
        }catch(err){
            return res.status(404).json({
                status: "error",
                message: err.message
            });
        }
    },
    search: (req, res) => {

        let searchContent = req.params.search;

        Article.find({ "$or": [
            {"title": {"$regex": searchContent, "$options": "i"}},
            {"content": {"$regex": searchContent, "$options": "i"}}
        ]})
        .sort({date: -1})
        .exec((err, articles) => {
            if(err || !articles || articles.length <= 0){
                return res.status(404).json({
                    status: "error",
                    message: "Not results found."
                })
            }else{
                return res.status(200).json({
                    status: "success",
                    articles: articles
                });
            }
        });

       
    }
}

module.exports = ArticleController;