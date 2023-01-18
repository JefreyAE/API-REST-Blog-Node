const { Router } = require("express");
const router = Router();

const ArticleController = require("../controllers/ArticleController");

router.post("/article/create", ArticleController.create);
router.get("/article/articles/:last?", ArticleController.getArticles);

module.exports = router;