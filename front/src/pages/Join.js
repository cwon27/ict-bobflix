import "../css/join.css";
import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const pass1 = useRef("");
  const pass2 = useRef("");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [zipcode, setZipcode] = useState("");
  const [addr, setAddr] = useState("");
  const [formData, setFormData] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [tel1, setTel1] = useState("");

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const modalStyle = {
    content: {
      top: "150px",
      left: "500px",
      width: "400px",
      height: "600px",
    },
  };
  function onComplete(e) {
    console.log(e);
    setZipcode(e.zonecode);
    setAddr(e.address);
    setIsOpen(false);
    setFormData((p) => {
      return { ...p, ["addr"]: e.zonecode };
    });
  }
  function submitCheck(e) {
    e.preventDefault();
    var username = document.getElementById("userid").value;
    // 실제로는 여기서 서버에 username 중복 검사 요청을 보내야 합니다.
    // 이 예시에서는 간단히 클라이언트 측에서 확인하는 방법을 사용합니다.

    postUserData();
  }

  function setNewsFormData(e) {
    let idField = e.target.name;
    let idValue = e.target.value;
    setFormData((p) => {
      return { ...p, [idField]: idValue };
    });
  }

  async function postUserData(e) {
    try {
      console.log(pass1.current.value);
      if (pass1.current.value != pass2.current.value) {
        alert("비밀번호를 확인해주세요");
        return false;
      }
      const result = await fetch("http://192.168.0.3:20020/join", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("start");
      navigate("/login");
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  async function useridCheck() {
    console.log("hihi");
    const result = await axios.get(`http://192.168.0.3:20020/join/check?id=${formData.userid}`);
    const res = result.data.result;
    if (res == 1) {
      setErrorMsg("사용이 가능한 아이디입니다.");
      document.getElementById("error_box").style.display = "block";
    } else {
      setErrorMsg("사용이 불가능한 아이디입니다.");
      document.getElementById("error_box").style.display = "block";
    }
  }
  function handleDomainChange(e) {
    setEmailDomain(e.target.value);
    setFormData((p) => {
      return { ...p, emailDomain: e.target.value };
    });
  }
  function handleTelChange(e) {
    setTel1(e.target.value);
    setFormData((p) => {
      return { ...p, tel1: e.target.value };
    });
  }

  return (
    <main className="join">
      <div style={{ textAlign: "center", marginTop: "250px" }} className="join-div">
        <h1>회원가입</h1>
      </div>
      <form class="join_form" method="post" onSubmit={submitCheck}>
        <div class="form-group-id">
          <div className="id_layer">
            <label>아이디:</label>
            <input type="text" name="userid" id="userid" required onChange={setNewsFormData} />
            <button type="button" class="check-duplicate-button" onClick={useridCheck}>
              중복 확인
            </button>
          </div>
          <div className="error_box" id="error_box">
            <span className="id_check_error">{errorMsg}</span>
          </div>
        </div>
        <div class="form-group">
          <label>비밀번호:</label>
          <input type="password" id="password" name="password" required onChange={setNewsFormData} ref={pass1} />
        </div>
        <div class="form-group">
          <label for="password_confirm">비밀번호 확인:</label>
          <input type="password" id="password_confirm" name="password_confirm" required onChange={setNewsFormData} ref={pass2} />
        </div>
        <div class="form-group">
          <label for="name">이름:</label>
          <input type="text" id="name" name="name" required onChange={setNewsFormData} />
        </div>
        <div class="form-group">
          <label for="name">닉네임:</label>
          <input type="text" id="name" name="nickName" required onChange={setNewsFormData} />
        </div>
        <div class="form-group">
          <label for="phone">연락처:</label>
          <select name="tel1" onChange={handleTelChange} className="contact-small" value={formData.tel1}>
            <option value="">선택</option>
            <option value="010">010</option>
            <option value="011">011</option>
            <option value="02">02</option>
            <option value="031">031</option>
          </select>
          -
          <input type="tel" id="phone1" name="tel2" onChange={setNewsFormData} />-
          <input type="tel" id="phone2" name="tel3" onChange={setNewsFormData} />
        </div>
        <div class="form-group">
          <label for="email">이메일:</label>
          <input type="text" id="email" name="email" required onChange={setNewsFormData} />@
          <select name="emailDomain" className="email-small" onChange={handleDomainChange} value={formData.emailDomain}>
            <option value="select">선택</option>
            <option value="gmail.com">gmail.com</option>
            <option value="naver.com">naver.com</option>
            <option value="daum.net">daum.net</option>
          </select>
        </div>

        <div class="form-group center-button">
          <button type="submit" class="submit-button">
            회원가입 하기
          </button>
        </div>
      </form>
    </main>
  );
}

export default Register;
