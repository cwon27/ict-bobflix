const express = require("express");
const {getCommunity, postCommunity, getPost, postSetLike, postSetHit, getComment, postComment, postSetCommentLike, deleteComment, deleteCommunity, putCommunity} = require("../model/communityModel");
const path = require('path');
const fs = require("fs");
const communityRouter = express.Router();

communityRouter.get("/banner-image", (req, res) => {
    const imagePath = path.join(__dirname, "..", "uploads", "community-banner.png");
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("배너 이미지 파일을 찾을 수 없습니다:", err);
            return res.status(404).send("Banner image not found");
        }
        res.sendFile(imagePath);
    });
});

communityRouter.route("/").get(getCommunity).post(postCommunity);
communityRouter.route("/:id").get(getPost).put(putCommunity).delete(deleteCommunity);
communityRouter.route("/:id/like").post(postSetLike);
communityRouter.post("/:id/incrementHits", postSetHit);
communityRouter.get("/comment/:id", getComment);
communityRouter.post("/comment", postComment);
communityRouter.post("/comment/:id/like", postSetCommentLike);
communityRouter.delete("/comment/:id", deleteComment);



module.exports = communityRouter;