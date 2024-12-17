import "../css/login.css";
import { Link } from "react-router-dom";
import { useState } from "react";
function Login() {
  //아이디, 비밀번호를 보관할 useState훅 변수 선언
  const [formData, setFormData] = useState({}); //아이디, 비밀번호 {userid:'abcd', userpwd:'1234'}
  //아이디 에러메시지 변수
  const [idErrorMessage, setIdErrorMessage] = useState("");
  //비밀번호 에러메시지 변수
  const [pwdErrorMessage, setPwdErrorMessage] = useState("");

  //폼의 값이 변경되면  hook에 값을 변경하는 작업을 수행한다.
  const setLoginFormData = (event) => {
    //기존에러 메시지 초기화
    setIdErrorMessage("");
    setPwdErrorMessage("");

    //이벤트가 발생한 input에서 name과 value얻어오기
    let idField = event.target.name;
    let idValue = event.target.value;

    //   setFormData(p=>{...p, userid:'abcd'})
    //   setFormData(p=>{...p, userpwd:'1234'})

    setFormData((p) => {
      return { ...p, [idField]: idValue };
    });

    console.log(formData);
  };
  //아이디, 비밀번호 입력유무 확인
  async function loginFormCheck(event) {
    event.preventDefault(); //기본 이벤트 제거

    //아이디 입력유무 확인
    if (formData.userid == null || formData.userid == "") {
      setIdErrorMessage("아이디를 입력하세요.");
      return false;
    }

    //비밀번호 입력유무 확인
    if (formData.userpwd == null || formData.userpwd == "") {
      setPwdErrorMessage("비밀번호를 입력하세요.");
      return false;
    }
    // 비동기식으로 서버에서 로그인 정보를 가져온다.
    try {
      const result = await fetch("http://192.168.0.3:20020/login", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { logStatus, userid } = await result.json();
      console.log(logStatus);
      if (logStatus == "Y") {
        //==============================
        sessionStorage.setItem("logStatus", "Y");
        sessionStorage.setItem("userid", userid);
        window.location.href = "/";
      } else {
        alert("로그인 실패하였습니다.");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <main className="login">
      <div id="logFrm">
        <form method="post" action="login.jsp" onSubmit={loginFormCheck}>
          <h1 className="logo">Bobflix</h1>
          <input type="text" name="userid" id="userid" placeholder="아이디" onChange={setLoginFormData} />
          <div className="login-error">
            <p>{idErrorMessage}</p>
          </div>
          <input type="password" name="userpwd" id="userpwd" placeholder="비밀번호" onChange={setLoginFormData} />
          <div className="login-error">
            <p>{pwdErrorMessage}</p>
          </div>
          <input type="submit" value="로그인" />
        </form>
        <div>
          <p>계정이 없으신가요?</p>
          <Link to="/join">회원가입</Link>
          {/* <a href="#">아이디/비밀번호 찾기</a> */}
        </div>
      </div>
    </main>
  );
}

export default Login;
