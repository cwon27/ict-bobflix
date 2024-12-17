const {postRecommendCreate, getRecommendList, getRecommendCatetory, getRecommendView, postRecommendEdit, getRecommendEdit, getRecommendDel, getRecommendListSearch, getReview, deleteReview, getRecommendCatetoryHits, getRecommendListHits, postReview, getRecommendCatetoryReview, getRecommendListReview} = require("../model/recommendModel");
const express = require("express");

const recommendRouter = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 업로드 폴더
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

recommendRouter.post("/create",upload.single('img'), postRecommendCreate);

recommendRouter.get("/postList/All", getRecommendList);

recommendRouter.get("/postList", getRecommendCatetory);

recommendRouter.get("/postView", getRecommendView);

recommendRouter.post("/postEdit", postRecommendEdit);


recommendRouter.get("/getEdit", getRecommendEdit);
recommendRouter.get("/postDel", getRecommendDel);

recommendRouter.get("/postListSearch", getRecommendListSearch);

recommendRouter.get("/review/:id", getReview);
recommendRouter.post("/review", postReview);
recommendRouter.delete("/review/:id", deleteReview);
recommendRouter.get("/postListHits", getRecommendCatetoryHits);
recommendRouter.get("/postList/AllHits", getRecommendListHits);
recommendRouter.get("/postList/AllReview", getRecommendListReview);
recommendRouter.get("/postListReview", getRecommendCatetoryReview);

module.exports = recommendRouter;