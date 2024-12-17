const fs = require("fs");
const path = require("path");

const mysql = require("mysql2");
const conn = mysql.createConnection({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "tiger1234",
  database: "mini1",
});

conn.connect();

const postRecommendCreate = (req, res) => {
  const title = req.body.title;
  const addr = req.body.addr;
  const optime = JSON.parse(req.body.optime); // JSON 문자열을 객체로 변환
  const tel = JSON.parse(req.body.tel); // JSON 문자열을 객체로 변환
  const menu = req.body.menu;
  const img = "/" + req.file.filename; // 파일 경로
  // console.log(req.file.filename);
  const grade = req.body.grade;
  const content = req.body.content;
  const code = req.body.code; // JSON 문자열을 객체로 변환
  const userid = req.body.userid;
  const optime2 = optime.startHour + ":" + optime.startMinute + " ~ " + optime.endHour + ":" + optime.endMinute;
  const tel2 = tel.areaCode + "-" + tel.tel2 + "-" + tel.tel3;

  const sql = "insert into recommend (title, addr, optime, tel, menu, img, grade, content, code, userid) " + " values(?,?,?,?,?,?,?,?,?,?)";
  conn.execute(sql, [title, addr, optime2, tel2, menu, img, grade, content, code, userid], function (error, result) {
    if (error || result.affectedRows == 0) {
      res.json({ result: 0 });
      console.log(error);
    } else {
      res.json({ result: 1 });
    }
  });
};

const getRecommendList = (request, response) => {
  var sql = "select r.idx, r.title, r.addr, c.name, r.hits, r.content, r.img , (select count(*) ";
  sql += "from re_comment where re_idx = r.idx) as ReviewCnt ";
  sql += "from recommend r join category c on r.code=c.code ";
  sql += "order by writedate desc";
  conn.execute(sql, function (e, record) {
    console.log(record);
    response.json({ record: record });
  });
};

const getRecommendCatetory = (request, response) => {
  let param = request.url.substring(request.url.indexOf("?") + 1); // code=뭐
  let data = new URLSearchParams(param);
  let code = data.get("code"); // 뭐
  console.log(code);

  var sql = "select r.idx, r.title, r.addr, c.name, r.hits, r.content, r.img , (select count(*) ";
  sql += "from re_comment where re_idx = r.idx) as ReviewCnt ";
  sql += "from recommend r join category c on r.code=c.code ";
  sql += "where r.code=? ";
  sql += "order by writedate desc";

  conn.execute(sql, [code], function (e, record) {
    console.log(record);
    response.json({ record: record });
  });
};

const getRecommendView = (request, response) => {
  // /newsView?news_no=8
  let param = request.url.substring(request.url.indexOf("?") + 1); // idx=뭐
  let data = new URLSearchParams(param);
  let idx = data.get("idx"); // 8
  console.log(idx);

  let sql1 = "update recommend set hits=hits+1 where idx=?;";
  let sql2 = "select r.idx, m.userid, m.userimg, m.nickname, date_format(r.writedate,'%y년 %m월 %d일') writedate, r.grade, r.content, r.title, c.name, r.addr, r.menu, r.optime, r.tel, r.hits, r.img ";
  sql2 += "from member m right join recommend r on m.userid=r.userid right join category c on r.code=c.code ";
  sql2 += "where idx=?;";

  conn.execute(sql1, [idx]);

  conn.execute(sql2, [idx], function (e, record) {
    console.log(record);
    var star = [];
    var starEmpty = [];
    for (var i = 1; i <= record[0].grade; i++) star.push(i);
    for (var i = 1; i <= 5 - record[0].grade; i++) starEmpty.push(i);
    response.json({ record: record[0], star: star, starEmpty: starEmpty });
  });
};

// 글 수정 - 목록 가져오기(혜린) ---------------------------------------------------------------------------------------

const getRecommendEdit = (req, res) => {
  // const title = req.body.title;
  // const addr = req.body.addr;
  // const optime = JSON.parse(req.body.optime);  // JSON 문자열을 객체로 변환
  // const tel = JSON.parse(req.body.tel);          // JSON 문자열을 객체로 변환
  // const menu = req.body.menu;
  // //const img = "/"+req.file.filename;   // 파일 경로
  // const grade = req.body.grade;
  // const content = req.body.content;
  // const code = req.body.code;         // JSON 문자열을 객체로 변환
  // const userid = 'user1';
  // const optime2 = optime.startHour + ":" + optime.startMinute + " ~ " + optime.endHour + ":" + optime.endMinute;
  // const tel2 = tel.areaCode + "-" + tel.tel2 + "-" + tel.tel3;
  // console.log(req.body);

  let param = req.url.substring(req.url.indexOf("?") + 1);
  let data = new URLSearchParams(param);
  let idx = data.get("idx");

  let sql = "select * from recommend where idx=?;";

  conn.execute(sql, [idx], function (error, result) {
    if (error) {
      res.status(500).json({ error: "DB query error" });
      return;
    } else {
      const start = result[0].optime.split("~")[0];
      const end = result[0].optime.split("~")[1];
      result[0].optime = { startHour: "", startMinute: "", endHour: "", endMinute: "" };
      result[0].optime.startHour = start.split(":")[0];
      result[0].optime.startMinute = start.split(":")[1].trim();
      result[0].optime.endHour = end.split(":")[0].trim();
      result[0].optime.endMinute = end.split(":")[1];
      const phone = result[0].tel.split("-");
      result[0].tel = { areaCode: "", tel2: "", tel3: "" };
      result[0].tel.areaCode = phone[0];
      result[0].tel.tel2 = phone[1];
      result[0].tel.tel3 = phone[2];

      res.json({ record: result[0] });
    }
  });
};

// 수정한 글 다시 보내기(혜린) --------------------------------------------------
const postRecommendEdit = (req, res) => {
  console.log(req.body.formData); // 여기까지 찍힌다
  const title = req.body.formData.title;
  const addr = req.body.formData.addr;
  const optime = req.body.formData.optime;
  const tel = req.body.formData.tel;
  const menu = req.body.formData.menu;
  // const img = req.file ? '/' + req.file.filename : req.body.img;
  const grade = req.body.formData.grade;
  const content = req.body.formData.content;
  const code = req.body.formData.code;
  // const userid = 'user1'; // 실제 서비스에서는 세션이나 토큰에서 가져오는 게 좋습니다
  const optime2 = `${optime.startHour}:${optime.startMinute} ~ ${optime.endHour}:${optime.endMinute}`;
  const tel2 = `${tel.areaCode}-${tel.tel2}-${tel.tel3}`;
  const idx = req.body.formData.idx;

  const sql = "update recommend set title = ?, addr = ?, optime = ?, tel = ?, menu = ?, grade = ?, content = ?, code = ? where idx=?;";
  console.log("Executing SQL:", sql);
  conn.execute(sql, [title, addr, optime2, tel2, menu, grade, content, code, idx], function (error, result) {
    if (error || result.affectedRows == 0) {
      // 에러가 있거나 수정된 내용이 없는 경우
      res.json({ result: 0 }); // 수정 안됨
      console.log("error");
    } else {
      res.json({ result: 1 }); // 수정됨
    }
  });
};

const getRecommendDel = (req, res) => {
  let param = req.url.substring(req.url.indexOf("?") + 1); // idx=뭐
  let data = new URLSearchParams(param);
  let idx = data.get("idx"); // 8
  console.log(idx);

  var sql = "delete from recommend where idx=?";

  conn.execute(sql, [idx], function (error, result) {
    if (error || result.affectedRows == 0) {
      res.json({ result: 0 });
    } else {
      res.json({ result: 1 });
    }
  });
};

const mysql2 = require("mysql2/promise");
const pool = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "tiger1234",
  database: "mini1",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

//sort hits category
const getRecommendCatetoryHits = (request, response) => {
  let param = request.url.substring(request.url.indexOf("?") + 1); // code=뭐
  let data = new URLSearchParams(param);
  let code = data.get("code"); // 뭐
  // console.log(code);

  let sql = "select idx, r.title, r.addr, c.name, r.hits, r.content, r.img, (select count(*) ";
  sql += "from re_comment where re_idx = r.idx) as ReviewCnt ";
  sql += "from recommend r join category c on r.code=c.code ";
  sql += "where r.code=? ";
  sql += "order by hits desc";

  conn.execute(sql, [code], function (e, record) {
    // console.log(record);
    response.json({ record: record });
  });
};

//sort hits all
const getRecommendListHits = (request, response) => {
  var sql = "select r.idx, r.title, r.addr, c.name, r.hits, r.content, r.img, (select count(*) ";
  sql += "from re_comment where re_idx = r.idx) as ReviewCnt ";
  sql += "from recommend r join category c on r.code=c.code order by hits desc";

  conn.execute(sql, function (e, record) {
    // console.log(record);
    response.json({ record: record });
  });
};

//sort review catecory
const getRecommendCatetoryReview = (request, response) => {
  let param = request.url.substring(request.url.indexOf("?") + 1); // code=뭐
  let data = new URLSearchParams(param);
  let code = data.get("code"); // 뭐
  // console.log(code);

  let sql = "select idx, r.title, r.addr, c.name, r.hits, r.content, r.img, (select count(*) ";
  sql += "from re_comment where re_idx = r.idx) as ReviewCnt ";
  sql += "from recommend r join category c on r.code=c.code ";
  sql += "where r.code=? ";
  sql += "order by ReviewCnt desc";

  conn.execute(sql, [code], function (e, record) {
    // console.log(record);
    response.json({ record: record });
  });
};

//sort review all
const getRecommendListReview = (request, response) => {
  var sql = "select r.idx, r.title, r.addr, c.name, r.hits, r.content, r.img, (select count(*) ";
  sql += "from re_comment where re_idx = r.idx) as ReviewCnt ";
  sql += "from recommend r join category c on r.code=c.code order by ReviewCnt desc";

  conn.execute(sql, function (e, record) {
    // console.log(record);
    response.json({ record: record });
  });
};

//search
const getRecommendListSearch = (request, response) => {
  let param = request.url.substring(request.url.indexOf("?") + 1); // keword=뭐
  let data = new URLSearchParams(param);
  let keyword = data.get("keyword"); // 뭐
  console.log(keyword);

  let keywordSearch = "%" + keyword + "%";
  console.log(keywordSearch);

  let sql = "select idx, r.title, r.addr, c.name, r.hits, r.content, r.img, (select count(*) ";
  sql += "from re_comment where re_idx = r.idx) as ReviewCnt ";
  sql += "from recommend r join category c on r.code=c.code ";
  sql += "where r.title like ? ";
  sql += "order by writedate desc";

  conn.execute(sql, [keywordSearch], function (e, record) {
    console.log(record);
    response.json({ record: record });
  });
};

//리뷰
const getReview = async (req, res) => {
  const { id } = req.params;

  try {
    const [newReview] = await pool.query(
      "select re.idx, re.re_idx, re.userid, re.content, re.grade, date_format(re.writedate,'%y.%m.%d') writedate, r.userid 'post_userid', m.userimg from re_comment re right join recommend r on re.re_idx=r.idx right join member m on re.userid=m.userid where re.re_idx = ? order by re.writedate desc;",
      [id]
    );
    console.log(newReview);
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const postReview = async (req, res) => {
  console.log("hihi get");
  const { review_idx, userid, content } = req.body;
  const grade = req.body.grade;
  console.log("grade : " + grade);
  try {
    const [result] = await pool.query("INSERT INTO re_comment (re_idx, userid, content, grade) VALUES (?, ?, ?, ?)", [review_idx, userid, content, grade]);
    const [newReview] = await pool.query("SELECT * FROM re_comment WHERE idx = ?", [result.insertId]);
    res.status(201).json(newReview[0]);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  try {
    const [result] = await pool.query("DELETE FROM re_comment WHERE idx = ?", [reviewId]);
    if (result.affectedRows > 0) {
      res.json({ message: "result deleted successfully" });
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  postRecommendCreate,
  getRecommendList,
  getRecommendCatetory,
  getRecommendCatetoryHits,
  getRecommendView,
  getReview,
  getRecommendListHits,
  getRecommendListSearch,
  postRecommendEdit,
  getRecommendEdit,
  getRecommendDel,
  postReview,
  deleteReview,
  getRecommendListReview,
  getRecommendCatetoryReview,
};
