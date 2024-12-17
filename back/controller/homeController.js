// user or 홈에서 처리하는 http요청

const { postJoin, getIdCheck, login, logout, getImage, getMypage, getMyCommunity, postUserEdit, getHomeCatetoryMenu, getMyRecommend } = require("../model/rootModel");
const express = require("express");
const multer = require("multer");
const homeRouter = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  const upload = multer({ storage: storage });
homeRouter.route("/join").post(postJoin);
homeRouter.get("/join/check", getIdCheck);
homeRouter.route('/login').post(login);
homeRouter.route("/logout").get(logout);
homeRouter.route("/imgs/:id").get(getImage);
homeRouter.get("/mypage/:id", getMypage);
homeRouter.get("/mypage/:id/community", getMyCommunity);
homeRouter.get("/mypage/:id/recommend", getMyRecommend);
homeRouter.post("/mypage/:id/edit",upload.single("img") , postUserEdit);
homeRouter.get("/home/recommends", getHomeCatetoryMenu);
module.exports = homeRouter;


