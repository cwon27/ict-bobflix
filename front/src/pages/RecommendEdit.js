import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../css/recommend_edit.css";
import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";
import { Star, StarFill } from "react-bootstrap-icons";

function RecommendEdit() {
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
  const handleGradeChange = (grade) => {
    setFormData((p) => {
      return { ...p, grade };
    });
  };

  //데이터를 보관할 useState훅 변수 선언
  const [formData, setFormData] = useState({
    title: "",
    addr: "",
    optime: { startHour: "", startMinute: "", endHour: "", endMinute: "" },
    tel: { areaCode: "", tel2: "", tel3: "" },
    menu: "",
    img: null,
    grade: 0,
    content: "",
    code: 0,
  });

  // 이전 페이지에서 보낸 데이터 request
  const { idx } = useParams();
  // 자동으로 함수 한 번 호출

  useEffect(() => {
    getPostView();
  }, []);

  // 폼의 값 변경되면 hook 값 변경
  const setPostFormData = (event) => {
    // 이벤트가 발생한 input에서 name, value 가져오기
    const { name, value } = event.target;

    setFormData((prevState) => {
      console.log(prevState);
      if (name.includes(".")) {
        const keys = name.split(".");
        const [key1, key2] = keys;
        return {
          ...prevState,
          [key1]: {
            ...prevState[key1],
            [key2]: value,
          },
        };
      } else {
        return {
          ...prevState,
          [name]: value,
        };
      }
    });
  };

  // DB정보 가져오기
  function getPostView() {
    axios
      .get(`http://192.168.0.3:20020/recommend/getEdit?idx=${idx}`)
      .then(function (response) {
        console.log(response.data.record);
        setFormData(response.data.record);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  //submit 발생시

  function postFormCheck(event) {
    event.preventDefault(); //기본 이벤트 제거

    //제목 입력유무 확인
    if (formData.title == null || formData.title == "") {
      alert("제목을 입력하세요.");
      return false;
    }

    const formDataToSend = new FormData();
    console.log(formData);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("addr", formData.addr);
    formDataToSend.append("optime", JSON.stringify(formData.optime));
    formDataToSend.append("tel", JSON.stringify(formData.tel));
    formDataToSend.append("menu", formData.menu);
    // formDataToSend.append('img', formData.img);
    formDataToSend.append("grade", formData.grade);
    formDataToSend.append("content", formData.content);
    formDataToSend.append("code", formData.code);
    formDataToSend.append("idx", idx);

    axios
      .post("http://192.168.0.3:20020/recommend/postEdit", {
        formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.result == 1) {
          // 글 수정 -> 글 내용으로 이동
          // window.location.href = '/postView/' + formData.idx;
          navigate(`/recommend/${idx}`);
        } else {
          // 글 수정 실패
          alert("뉴스 수정 실패");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <main>
      <div className="recommend_create">
        <form className="restaurant-form" onSubmit={postFormCheck}>
          <h1>내 추천 수정하기</h1>
          <div className="contents-con">
            <label>
              <ul>
                <li>식당 이름</li>
                <li>
                  <input type="text" name="title" value={formData.title} onChange={setPostFormData} />
                </li>
              </ul>
            </label>
            <label>
              <ul className="recommend_create_addr">
                <li>주소</li>
                <li>
                  <input type="text" name="addr" value={formData.addr} onChange={setPostFormData} />

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
                    <select name="startHour" value={formData.optime.startHour} onChange={setPostFormData}>
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
                    <select name="startMinute" value={formData.optime.startMinute} onChange={setPostFormData}>
                      <option>선택</option>
                      <option>00</option>
                      <option>10</option>
                      <option>20</option>
                      <option>30</option>
                      <option>40</option>
                      <option>50</option>
                    </select>
                    <div className="etc">~</div>
                    <select name="endHour" value={formData.optime.endHour} onChange={setPostFormData}>
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
                    <select name="endMinute" value={formData.optime.endMinute} onChange={setPostFormData}>
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
                    <select name="areaCode" value={formData.tel.areaCode} onChange={setPostFormData}>
                      <option>010</option>
                      <option>02</option>
                      <option>031</option>
                    </select>
                    <div className="etc">-</div>
                    <input type="text" name="tel2" maxLength="4" value={formData.tel.tel2} onChange={setPostFormData}></input>
                    <div className="etc">-</div>
                    <input type="text" name="tel3" maxLength="4" value={formData.tel.tel3} onChange={setPostFormData}></input>
                  </div>
                </li>
              </ul>
            </label>
            <label>
              <ul>
                <li>음식 분류</li>
                <li>
                  <div className="food-type-inputs">
                    <input type="radio" name="code" value="10" onChange={setPostFormData} checked={formData.code == 10} />
                    한식
                    <input type="radio" name="code" value="20" onChange={setPostFormData} checked={formData.code == 20} />
                    중식
                    <input type="radio" name="code" value="30" onChange={setPostFormData} checked={formData.code == 30} />
                    양식
                    <input type="radio" name="code" value="40" onChange={setPostFormData} checked={formData.code == 40} />
                    일식
                    <input type="radio" name="code" value="50" onChange={setPostFormData} checked={formData.code == 50} />
                    기타
                  </div>
                </li>
              </ul>
            </label>
            <label id="menu">
              <ul>
                <li>대표메뉴</li>
                <li>
                  <input type="text" name="menu" value={formData.menu} onChange={setPostFormData} />
                </li>
              </ul>
            </label>
            <label>
              <ul>
                <li>이미지</li>
                <li>
                  <input src={`${formData.img}`} type="file" name="img" onChange={setPostFormData} />
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
                  <input type="text" name="content" value={formData.content} onChange={setPostFormData} />
                </li>
              </ul>
            </label>
          </div>
          <label className="recommend_edit_btn">
            <button type="submit">수정</button>
            <button>
              <Link to={`/recommend/${idx}`}>취소</Link>
            </button>
          </label>
        </form>
      </div>
    </main>
  );
}
export default RecommendEdit;
