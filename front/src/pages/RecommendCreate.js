import React, { useState } from "react";
import axios from "axios";
import "../css/recommend_create.css";
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";
import { Star, StarFill } from "react-bootstrap-icons";

function RecoForm() {
  const [addr, setAddr] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
    setAddr(e.address);
    setIsOpen(false);
    setFormData((p) => {
      return { ...p, ["addr"]: e.address };
    });
  }
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    addr: "",
    optime: { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    tel: { areaCode: "010", tel2: "", tel3: "" },
    menu: "",
    img: null,
    grade: 0,
    content: "",
    code: 0,
  });
  const [userid, setUserid] = useState(sessionStorage.getItem("userid"));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    //번호 유효성검사
    const numericRegex = /^[0-9]*$/;
    if (name === "tel2" || name === "tel3") {
      if (numericRegex.test(value)) {
        setFormData((p) => ({ ...p, tel: { ...p.tel, [name]: value } }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "숫자만 입력 가능합니다." }));
      }
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((p) => {
      return { ...p, img: e.target.files[0] };
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData((p) => ({
      ...p,
      code: e.target.value, // 코드값을 문자열로 저장
    }));
    setErrors((prevErrors) => ({ ...prevErrors, code: "" }));
  };

  const handleGradeChange = (grade) => {
    setFormData((p) => {
      return { ...p, grade };
    });
  };

  const validateForm = () => {
    let isValid = true;
    let tempErrors = {};

    // 제목 입력 유무
    if (!formData.title) {
      tempErrors.title = "식당 이름을 입력해주세요.";
      isValid = false;
    }

    // 분류 입력 유무
    if (!formData.code) {
      tempErrors.code = "음식 분류를 선택해주세요.";
      isValid = false;
    }
    // 대표메뉴 입력 유무
    if (!formData.menu) {
      tempErrors.menu = "대표메뉴를 입력해주세요.";
      isValid = false;
    }
    // 이미지 입력 유무
    if (!formData.img) {
      tempErrors.img = "이미지를 1개 이상 업로드해주세요.";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  //submit 발생

  const start = async (e) => {
    e.preventDefault(); //기본 이벤트 제거

    if (validateForm()) {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title);
      formDataToSend.append("addr", formData.addr);
      formDataToSend.append("optime", JSON.stringify(formData.optime));
      formDataToSend.append("tel", JSON.stringify(formData.tel));
      formDataToSend.append("menu", formData.menu);
      formDataToSend.append("img", formData.img);
      console.log(formData);
      formDataToSend.append("grade", formData.grade);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("code", formData.code);
      formDataToSend.append("userid", userid);

      try {
        const response = await axios.post("http://192.168.0.3:20020/recommend/create", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.result === 1) {
          console.log(response.data);
          navigate(`/recommend?code=${100}`);
        } else {
          alert("추천 등록 실패");
        }
      } catch (error) {
        console.log(error);
        alert("서버와의 통신에서 오류가 발생했습니다.");
      }
    }
  };

  return (
    <main className="recommend_create_box">
      <div className="recommend_create">
        <form className="restaurant-form" onSubmit={start}>
          <h1>추천 맛집 작성하기</h1>
          <div className="contents-con">
            <label>
              <ul>
                <li>식당 이름</li>
                <li>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} />
                </li>
              </ul>
            </label>
            <label>
              <ul className="recommend_create_addr">
                <li>주소</li>
                <li>
                  <input type="text" name="addr" value={formData.addr} onChange={handleChange} />
                  <button type="button" class="find-zipcode-button" onClick={openModal}>
                    주소 찾기
                  </button>
                  <Modal isOpen={isOpen} onRequestClose={closeModal} style={modalStyle}>
                    <DaumPostcode onComplete={onComplete}></DaumPostcode>
                    <button onClick={closeModal}>닫기</button>
                  </Modal>
                </li>
              </ul>
            </label>
            <label>
              <ul>
                <li>운영시간</li>
                <li>
                  <div className="optime">
                    <select name="startHour" value={formData.optime.startHour} onChange={(e) => setFormData({ ...formData, optime: { ...formData.optime, startHour: e.target.value } })}>
                      <option>선택</option>
                      {Array.from({ length: 24 }).map((_, i) => {
                        const displayValue = String(i).padStart(2, "0");
                        return (
                          <option key={i} value={i}>
                            {displayValue}
                          </option>
                        );
                      })}
                    </select>
                    <div className="etc">:</div>
                    <select name="startMinute" value={formData.optime.startMinute} onChange={(e) => setFormData({ ...formData, optime: { ...formData.optime, startMinute: e.target.value } })}>
                      <option>선택</option>
                      <option>00</option>
                      <option>10</option>
                      <option>20</option>
                      <option>30</option>
                      <option>40</option>
                      <option>50</option>
                    </select>
                    <div className="etc">~</div>
                    <select name="endHour" value={formData.optime.endHour} onChange={(e) => setFormData({ ...formData, optime: { ...formData.optime, endHour: e.target.value } })}>
                      <option>선택</option>
                      {Array.from({ length: 24 }).map((_, i) => {
                        const displayValue = String(i).padStart(2, "0");
                        return (
                          <option key={i} value={i}>
                            {displayValue}
                          </option>
                        );
                      })}
                    </select>
                    <div className="etc">:</div>
                    <select name="endMinute" value={formData.optime.endMinute} onChange={(e) => setFormData({ ...formData, optime: { ...formData.optime, endMinute: e.target.value } })}>
                      <option>선택</option>
                      <option>00</option>
                      <option>10</option>
                      <option>20</option>
                      <option>30</option>
                      <option>40</option>
                      <option>50</option>
                    </select>
                  </div>
                </li>
              </ul>
            </label>
            <label>
              <ul>
                <li>전화번호</li>
                <li>
                  <div className="tel">
                    <select name="areaCode" value={formData.tel.areaCode} onChange={(e) => setFormData({ ...formData, tel: { ...formData.tel, areaCode: e.target.value } })}>
                      <option value="010">010</option>
                      <option value="02">02</option>
                      <option value="031">031</option>
                    </select>
                    <div className="etc">-</div>
                    <input type="text" name="tel2" maxLength="4" value={formData.tel.tel2} onChange={handleChange}></input>
                    <div className="etc">-</div>
                    <input type="text" name="tel3" maxLength="4" value={formData.tel.tel3} onChange={handleChange}></input>
                  </div>
                </li>
              </ul>
            </label>
            <label>
              <ul>
                <li>음식 분류</li>
                <li>
                  <div className="food-type-inputs">
                    <input type="radio" name="code" value="10" checked={formData.code === "10"} onChange={handleCheckboxChange} />
                    한식
                    <input type="radio" name="code" value="20" checked={formData.code === "20"} onChange={handleCheckboxChange} />
                    중식
                    <input type="radio" name="code" value="30" checked={formData.code === "30"} onChange={handleCheckboxChange} />
                    양식
                    <input type="radio" name="code" value="40" checked={formData.code === "40"} onChange={handleCheckboxChange} />
                    일식
                    <input type="radio" name="code" value="50" checked={formData.code === "50"} onChange={handleCheckboxChange} />
                    기타
                  </div>
                </li>
              </ul>
            </label>
            <label id="menu">
              <ul>
                <li>대표메뉴</li>
                <li>
                  <input type="text" name="menu" value={formData.menu} onChange={handleChange} />
                </li>
              </ul>
            </label>
            <label>
              <ul>
                <li>이미지</li>
                <li className="file_input">
                  <input type="file" name="img" onChange={handleFileChange} />
                </li>
              </ul>
            </label>
            <label>
              <ul>
                <li>별점</li>
                <li>
                  <div className="grade-inputs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} onClick={() => handleGradeChange(i + 1)}>
                        {i < formData.grade ? <StarFill /> : <Star />}
                      </span>
                    ))}
                  </div>
                </li>
              </ul>
            </label>
            <label>
              <ul>
                <li>한줄 코멘트</li>
                <li>
                  <input type="text" name="content" value={formData.content} onChange={handleChange} />
                </li>
              </ul>
            </label>
          </div>

          <button className="recommend_create_btn" type="submit">
            등록
          </button>
        </form>
      </div>
    </main>
  );
}
export default RecoForm;
