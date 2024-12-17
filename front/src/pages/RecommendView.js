import "../css/recommend_view.css";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import resImg from "./img/img1.jpg";
import { Star, StarFill, GeoAltFill, Clock, TelephoneFill, Trash, ClipboardHeart } from "react-bootstrap-icons";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

function RecommendView() {
  const navigate = useNavigate();
  // DB
  const [postView, setPostView] = useState({});

  //이전 페이지에서 보낸 데이터 request하기
  const { id } = useParams(); // 레코드 번호가 담김

  //식당글 별점
  const [grade, setGrade] = useState([]);
  const [gradeEmpty, setGradeEmpty] = useState([]);

  //자동으로 1번 함수 호출되는 기능 구현
  const ismounted = useRef(false);
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [map, setMap] = useState();
  const [state, setState] = useState({
    // 지도의 초기 위치
    center: { lat: 37.49676871972202, lng: 127.02474726969814 },
    // 지도 위치 변경시 panto를 이용할지(부드럽게 이동)
    isPanto: true,
  });
  const { kakao } = window;
  useEffect(() => {
    if (!ismounted.current) {
      ismounted.current = true;
    } else {
      getPostView();
      fetchReviews();
    }
  }, []);

  // 서버에서 해당글 가져올 함수
  var getPostView = () => {
    console.log(id);
    //백엔드
    axios
      .get(`http://192.168.0.3:20020/recommend/postView?idx=${id}`) // 변수 넣을땐 ` 로 묶어주기
      .then(function (response) {
        setPostView(response.data.record);
        console.log(response);
        setGrade(response.data.star);
        setGradeEmpty(response.data.starEmpty);

        // if (!map) return
        const SearchMap = () => {
          const geocoder = new kakao.maps.services.Geocoder();
          let callback = function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
              const newSearch = result[0];
              setState({
                center: { lat: newSearch.y, lng: newSearch.x },
              });
            }
          };
          console.log(response.data.record.addr);
          geocoder.addressSearch(`${response.data.record.addr}`, callback);
        };
        SearchMap();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // logStatus
  const [logStatus, setLogStatus] = useState(sessionStorage.getItem("logStatus"));
  const [userid, setUserid] = useState(sessionStorage.getItem("userid"));

  // 리뷰기능
  const [review, setReview] = useState([]);
  const [newReview, setNewReview] = useState("");

  // 리뷰 제출 핸들러
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://192.168.0.3:20020/recommend/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review_idx: id,
          userid: userid, // 실제 사용자 인증 시스템에 따라 변경 필요
          content: newReview,
          grade: gradeInData,
        }),
      });
      if (response.ok) {
        setGradeClick([false, false, false, false, false]);
        await setNewReview("");
        await fetchReviews();
      } else {
        console.error("Failed to post review");
      }
    } catch (error) {
      console.error("Error posting review:", error);
    }
  };

  // 리뷰 데이터 가져오기
  async function fetchReviews() {
    setTimeout(async () => {
      try {
        const response = await fetch(`http://192.168.0.3:20020/recommend/review/${id}`);
        if (response.ok) {
          const data = await response.json();
          await setReview(data);

          console.log(review); //여기가 빈레코드가 들어옴.. -> ㄴㄴ 들어옴
        } else {
          console.error("Failed to fetch review");
        }
      } catch (error) {
        console.error("Error fetching review : ", error);
      }
    }, 10);
  }

  // 리뷰 삭제 핸들러
  const handleReviewDelete = async (reviewId) => {
    if (window.confirm("이 리뷰를 삭제할까요?")) {
      try {
        const response = await fetch(`http://192.168.0.3:20020/recommend/review/${reviewId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchReviews();
        } else {
          console.error("Failed to delete review");
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  function delCheck() {
    if (window.confirm("삭제할까요?")) {
      axios
        .get(`http://192.168.0.3:20020/recommend/postDel?idx=${id}`)
        .then(function (response) {
          console.log(response);
          if (response.data.result === 1) {
            // 삭제됨 -> 목록으로 이동
            navigate("/recommend");
          } else {
            alert("글 삭제 실패");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  //리뷰 별점

  const [gradeClick, setGradeClick] = useState([false, false, false, false, false]);
  const [gradeInData, setGradeInData] = useState(0);
  const handleGradeClick = (e, index) => {
    e.preventDefault();
    let clickStates = [...gradeClick];
    for (let i = 0; i < 5; i++) {
      clickStates[i] = i <= index ? true : false;
    }

    setGradeClick(clickStates);
    console.log("click1 : " + gradeClick);
  };

  function gradeInput() {
    let score = gradeClick.filter(Boolean).length;
    setGradeInData(score);
    console.log("data : " + gradeInData);
  }

  useEffect(() => {
    console.log(gradeClick);
    gradeInput();
    console.log(gradeInData);
  }, [gradeClick, gradeInData]);

  return (
    <>
      <main>
        <div className="container" style={{ marginTop: "100px" }}>
          <div id="post-top">
            <div>
              <a href="">
                <img src={`http://192.168.0.3:20020/uploads/${postView.userimg}`} />
              </a>
              <a href="">{postView.userid}</a>
              <span style={{ padding: "3px 5px 3px 3px" }}>.</span>
              <span style={{ color: "#545454", fontSize: "1.2em" }}>{postView.writedate}</span>
            </div>
            {userid === postView.userid && (
              <div style={{ textAlign: "right" }}>
                <Link to={`/recommend/edit/${postView.idx}`}>
                  <input type="button" value="수정" className="btn btn-outline-secondary input-button" style={{ border: "0", padding: "3px 3px", fontSize: "1.3em" }} />
                </Link>
                <input type="button" value="삭제" className="btn btn-outline-secondary input-button" style={{ border: "0", padding: "3px 3px", fontSize: "1.3em" }} onClick={delCheck} />
              </div>
            )}
          </div>
          <div id="contents">
            <img src={`http://192.168.0.3:20020/uploads/${postView.img}`} />
            <div className="star">
              {grade.map(function () {
                return (
                  <>
                    <StarFill className="star-icon" size={50} />
                  </>
                );
              })}
              {gradeEmpty.map(function () {
                return (
                  <>
                    <Star className="star-icon" size={50} />
                  </>
                );
              })}
              <span className="user-coment">{postView.content}</span>
            </div>
            <div className="title">
              <h1 style={{ fontWeight: "bold", fontSize: "3.3em" }}>{postView.title}</h1>
              <span className="food-list">{postView.name}</span>
            </div>

            <div className="inform-list">
              <ClipboardHeart className="inform-icon" size={24} />
              <span>{postView.menu}</span>
            </div>
            <div className="inform-list">
              <Clock className="inform-icon" size={24} />
              <span>{postView.optime}</span>
            </div>
            <div className="inform-list">
              <TelephoneFill className="inform-icon" size={24} />
              <span>{postView.tel}</span>
            </div>
            <div className="inform-list">
              <GeoAltFill className="inform-icon" size={24} />
              <span>{postView.addr}</span>
            </div>

            <div className="recommend_map_box">
              <Map // 로드뷰를 표시할 Container
                center={state.center}
                style={{
                  width: "100%",
                  height: "400px",
                  borderRadius: "30px",
                  border: "1px solid #B3B3B3",
                }}
                isPanto={state.isPanto}
                level={3}
              >
                <MapMarker position={state.center}></MapMarker>
              </Map>
            </div>
            <div className="post-bottom">
              <span>조회수 </span>
              <span>{postView.hits}</span>
            </div>
          </div>

          {/* 리뷰기능 */}
          <div id="review-input">
            <p style={{ marginLeft: "10px", fontSize: "1.1em" }}>{review.length}개의 리뷰</p>
            {logStatus == "Y" && (
              <form onSubmit={handleReviewSubmit}>
                <div className="input-grade">
                  <span style={{ fontSize: "0.7em", marginRight: "10px" }}>별점 : </span>

                  <div className="grade-inputs-chaewon">
                    {/* 별표시되는 공간 */}
                    {[1, 2, 3, 4, 5].map(function (p, i) {
                      return (
                        <>
                          <span onClick={(e) => handleGradeClick(e, i)}>{gradeClick[i] ? <StarFill className="star-icon" size={25} /> : <Star className="star-icon" size={25} />}</span>
                        </>
                      );
                    })}
                  </div>
                </div>

                <textarea className="comment_input" placeholder="리뷰를 작성하세요." value={newReview} onChange={(e) => setNewReview(e.target.value)}></textarea>
                <div style={{ textAlign: "right" }}>
                  <input type="submit" value="리뷰 작성" />
                </div>
              </form>
            )}
          </div>
          <div className="review-list">
            {review.map((record) => {
              return (
                <div className="review-div">
                  <div key={record.idx} className="user-div">
                    <img src={`http://192.168.0.3:20020/uploads/${record.userimg}`} />
                    <span className="username">{record.userid}</span>
                    <div className="user-star">
                      {Array.from({ length: record.grade }).map(function () {
                        return (
                          <>
                            <StarFill className="star-icon" size={20} />
                          </>
                        );
                      })}
                      {Array.from({ length: 5 - record.grade }).map(function () {
                        return (
                          <>
                            <Star className="star-icon" size={20} />
                          </>
                        );
                      })}
                    </div>
                    <p className="writedate">{record.writedate}</p>
                    {(userid == record.userid || userid == record.post_userid) && (
                      <button className="deleteBtn" onClick={() => handleReviewDelete(record.idx)}>
                        <Trash />
                      </button>
                    )}
                  </div>
                  <div className="text-div">
                    <span>{record.content}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

export default RecommendView;
