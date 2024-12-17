const mysql = require("mysql2");
const path = require("path");
const fs = require('fs');
var session = require('express-session');


const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'tiger1234',
  database: 'mini1'
});

connection.connect();





const postJoin = (req, res) => {
  const {userid, password, name, nickName, tel1, tel2, tel3, email, emailDomain} = req.body;
  const tel = tel1+"-"+tel2+"-"+tel3;
  const userEmail = email+"@"+emailDomain;
  console.log(req.body);
  const sql = "insert into member(userid, userpwd, username, nickname, tel, email) values(?, ?, ?, ?, ?, ?)";

  connection.execute(sql, [userid, password, name, nickName, tel, userEmail], (error, result)=>{
    if(error || result.affectedRows==0){
      console.log(error);
      res.json({result:0});
  }
  else{
      res.json({result:1});
  }
  });
};

const getIdCheck = (req, res)=>{
  const {id} = req.query;
  const sql = "select * from member where userid=?";
  connection.execute(sql, [id], (error, result)=>{
    if(result.length==0){
      res.json({result:1});
    }
    else{
    res.json({result: 0});
  }
}
);
}

const login = (req,res)=>{
  var userid= req.body.userid;
  var userpwd= req.body.userpwd;
  console.log(userid,userpwd)

  var sql = "select userid, username from member where userid=? and userpwd=?";

  connection.execute(sql, [userid,userpwd],function(error, result){
      if(!error && result.length>0){//로그인 성공시
          console.log("성공");
      session.user ={
          userid:result[0].userid,
          username:result[0].username,
          autorized:true
      }
      res.json({logStatus:'Y', userid});
      }else{//로그인 실패시
      res.json({logStatus:'N'});
      }
  });
};

const getImage = (req, res) =>{
  const {id} = req.params;
  const sql = "select userimg from member where userid=?";
  connection.execute(sql, [id], (error, result)=>{
    const imgPath = path.join(__dirname, "../uploads", result[0].userimg);
    res.sendFile(imgPath, (error)=>{
    if(error){
      console.log("Error : "+ error);
      res.status(404).send("imge not found");
    }
  })
  })

  
}

const logout  = (req, res)=>{
  session.user=null;
  console.log('로그아웃.. 세션지우러')
  res.json({logout:'yes'});
};

const getMypage = (req, res)=>{
  const {id}= req.params;
  const sql = "select * from member where userid=?";
  connection.execute(sql, [id], (error, result)=>{
    const imgPath = path.join(__dirname, "../uploads", result[0].userimg);
    const img = fs.readFileSync(imgPath, {encoding: 'base64'});
    result[0].userimg = `data:image/png;base64,${img}`;

    const subTel = result[0].tel.split("-");
    result[0].tel1 = subTel[0];
    result[0].tel2 = subTel[1];
    result[0].tel3 = subTel[2];
    
    result[0].emailF = result[0].email.split("@")[0];
    result[0].emailDomain = result[0].email.split("@")[1];
    res.json(result[0]);
  })
}
const getMyCommunity = (req,res)=>{
  const {id}= req.params;
  const sql = 'select c.idx, c.title, c.hits from member m join community c on c.userid=m.userid where m.userid=?';

  connection.execute(sql, [id], (error, result)=>{ 
    
    res.json(result)});
}
const getMyRecommend = (req, res) =>{
  const {id}= req.params;
  const sql = 'select r.idx, r.title, r.img from recommend r join member m on r.userid=m.userid where m.userid=?';
  connection.execute(sql, [id], (error, result)=>{
    console.log(result);
    res.json(result)
  })
}
const postUserEdit = (req, res, next) => {
  const {id} = req.params;
  console.log(req.file);
  console.log(req.body.formData);
  const { username, nickname, tel1, tel2, tel3, emailF, emailDomain } = req.body.formData;
  let userImage;
  try{
      userImage ="/"+req.file.filename;
  }
  catch(error){
    
    userImage = '/default.png';
  }
  
  
  const tel = tel1+"-"+tel2+"-"+tel3;
  const email = emailF+'@'+emailDomain;
const sql = "update member set username =?, nickname =?, tel =?, email =?, userimg=? where userid=?";
// console.log(req.body);
 
connection.query(sql,[username, nickname, tel, email, userImage, id] ,(error, results) => {
  
  if (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating user information" });
  } else {
    console.log("User updated successfully");
    res.json({ message: "User information updated successfully", results });
  }
});
}

const mysql2 = require('mysql2/promise');
const pool = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tiger1234',
    database: 'mini1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
const getHomeCatetoryMenu = async (req, res)=>{
    
    let sql1 = "select idx, r.title, r.addr, c.name, r.hits, r.content, r.img ";
    sql1 += "from recommend r join category c on r.code=c.code ";
    sql1 += "where r.code=10 ";
    sql1 += "order by writedate desc limit 4";
    let sql2 = "select idx, r.title, r.addr, c.name, r.hits, r.content, r.img ";
    sql2 += "from recommend r join category c on r.code=c.code ";
    sql2 += "where r.code=20 ";
    sql2 += "order by writedate desc limit 4";
    let sql3 = "select idx, r.title, r.addr, c.name, r.hits, r.content, r.img ";
    sql3 += "from recommend r join category c on r.code=c.code ";
    sql3 += "where r.code=30 ";
    sql3 += "order by writedate desc limit 4";
    let sql4 = "select idx, r.title, r.addr, c.name, r.hits, r.content, r.img ";
    sql4 += "from recommend r join category c on r.code=c.code ";
    sql4 += "where r.code=40 ";
    sql4 += "order by writedate desc limit 4";
    let sql5 = "select idx, r.title, r.addr, c.name, r.hits, r.content, r.img ";
    sql5 += "from recommend r join category c on r.code=c.code ";
    sql5 += "where r.code=50 ";
    sql5 += "order by writedate desc limit 4";
    const [record1] = await pool.query(sql1);
    const [record2] = await pool.query(sql2);
    const [record3] = await pool.query(sql3);
    const [record4] = await pool.query(sql4);
    const [record5] = await pool.query(sql5);
    const result = [record1, record2, record3, record4, record5];
    res.json(result);
}

module.exports = { postJoin, login, logout, getImage, getIdCheck, getMypage, getMyCommunity,getMyRecommend, postUserEdit, getHomeCatetoryMenu};
