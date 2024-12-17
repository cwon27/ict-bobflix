const homeRouter = require("./controller/homeController");
const communityRouter = require("./controller/communityController");
const recommendRouter =require("./controller/recommendController");
const cors = require("cors")
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");


const app = express();

app.use(cors());
app.use(express.json()); 
app.use(bodyParser.urlencoded({extended: true}));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", homeRouter);
app.use("/community", communityRouter);
app.use("/recommend", recommendRouter);



var mysql = require("mysql2");

// DB 연결


// react의 요청에 응답할 수 있도록 CORS를 설정한다.
// npm install cors
app.use(cors());
app.use(express.json());

// 식당리스트 전체 게시물


// 식당리스트 카테고리 선택


// 식당 선택 뷰



app.listen(20020, () => {
  console.log("server start http://127.0.0.1:20020");
});
