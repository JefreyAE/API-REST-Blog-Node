const { Router } = require("express");
const multer = require("multer");
const router = Router();
const ArticleController = require("../controllers/ArticleController");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./images/articles/");

    },
    filename: function(req, file, cb){
        cb(null, "article" + Date.now() + file.originalname);
    }
})

const uploads = multer({storage: storage});

router.post("/article/create", ArticleController.create);
router.get("/article/articles/:last?", ArticleController.getArticles);
router.get("/article/article/:id", ArticleController.getArticle);
router.delete("/article/article/:id", ArticleController.delete);
router.put("/article/article/:id", ArticleController.update);
router.post("/article/upload-image/:id", [uploads.single("file0")], ArticleController.uploadImage);
router.get("/article/image/:file", ArticleController.getImage);
router.get("/article/search/:search", ArticleController.search);

module.exports = router;