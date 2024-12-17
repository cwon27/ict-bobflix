import "../css/recommend_list.css";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import { Link, useSearchParams } from "react-router-dom";

function RecommendList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category_code = searchParams.get("code") || 100;
  const [logStatus, setLogStatus] = useState(sessionStorage.getItem("logStatus"));

  const sortname = ["최신순", "조회수 많은순", "리뷰 많은순"];

  const foodtype = [
    { code: 100, name: "전체" },
    { code: 10, name: "한식" },
    { code: 20, name: "중식" },
    { code: 30, name: "양식" },
    { code: 40, name: "일식" },
    { code: 50, name: "기타" },
  ];

  // radio
  const [radioChecked, setRadioChecked] = useState(category_code);

  const radioHandler = (e) => {
    //console.log(e.target.value);
    setRadioChecked(e.target.value);
    e.target.checked = true;
    //console.log(radioChecked);
    if (e.target.value == 100) {
      getPostListAll();
    } else {
      getPostList(e.target.value);
    }
  };

  // sort
  const sortHandler = (e) => {
    
    console.log(e.target.value);
    console.log("라디오체크" + radioChecked);
    if (e.target.value == "최신순") {
      if (radioChecked == 100) {
        getPostListAll();
      } else {
        getPostList(radioChecked);
      }
    } else if (e.target.value == "조회수 많은순") {
      if (radioChecked == 100) {
        getPostListAllHits();
      } else {
        getPostListHits(radioChecked);
      }
    } else if (e.target.value == "리뷰 많은순") {
      if (radioChecked == 100) {
        getPostListAllReview();
      } else {
        getPostListReview(radioChecked);
      }
    }
    
    
  };

  //정렬 함수(조회수)
  function getPostListHits(p) {
    axios
      .get("http://192.168.0.3:20020/recommend/postListHits?code=" + p)
      .then(function (response) {
        console.log(response.data);
        console.log(response.data.record);
        setPostList(response.data.record);
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  function getPostListAllHits() {
    axios
      .get("http://192.168.0.3:20020/recommend/postList/AllHits")
      .then(function (response) {
        console.log(response.data);
        setPostList(response.data.record);
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  //정렬 함수(리뷰수)
  function getPostListReview(p) {
    axios
      .get("http://192.168.0.3:20020/recommend/postListReview?code=" + p)
      .then(function (response) {
        console.log(response.data);
        console.log(response.data.record);
        setPostList(response.data.record);
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  function getPostListAllReview() {
    axios
      .get("http://192.168.0.3:20020/recommend/postList/AllReview")
      .then(function (response) {
        console.log(response.data);
        setPostList(response.data.record);
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  // 카테고리 함수
  function getPostList(p) {
    axios
      .get("http://192.168.0.3:20020/recommend/postList?code=" + p)
      .then(function (response) {
        setPostList(response.data.record);
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  //DB
  var [postList, setPostList] = useState([]);

  // 현재 페이지는 처음에 getPostList()함수를 자동으로 호출하여 식당목록을 서버에서 가져와야한다.
  const ismounted = useRef(false);

  useEffect(() => {
    if (!ismounted.current) {
      ismounted.current = true;
    } else {
      // console.log(category_code);
      if (category_code == 100) {
        getPostListAll();
      } else {
        getPostList(category_code); //?
      }
    }
  }, []);

  async function getPostListAll() {
    axios
      .get("http://192.168.0.3:20020/recommend/postList/All")
      .then(function (response) {
        console.log(response.data);
        setPostList(response.data.record);
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  // search input data 얻기
  const [inputData, setInputData] = useState("");

  const searchInputHandler = (e) => {
    //console.log(e.target.value);
    

    setInputData(e.target.value);
    
  };
  function keyWordEnter(e){
    if(e.key === "Enter"){
      listSearch();
    }
  }
  function listSearch() {
    console.log("인풋데이터" + inputData);

    axios
      .get("http://192.168.0.3:20020/recommend/postListSearch?keyword=" + inputData)
      .then(function (response) {
        console.log(response.data);
        console.log(response.data.record);
        setPostList(response.data.record);
        setInputData("");
      })
      .catch(function (e) {
        console.log(e);
      });
  }

  return (
    <main>
      <img src="img/list_banner.png" className="list-banner-img" />
      <div className="res-input-btn-div">
        {logStatus == "Y" && (
          <Link to="/recommend/create">
            <input type="button" value="식당 입력하기" className="res-input" />
          </Link>
        )}
      </div>

      <div className="container" style={{ display: "flex", marginTop: "100px" }}>
        <div className="col-md-3">
          <div className="left-div">
            <h3>음식 타입</h3>
            {foodtype.map(function (p, i) {
              return (
                <label className="food-type">
                  <input type="radio" name="foodtype" id="foodtype" checked={radioChecked == foodtype[i].code} value={foodtype[i].code} onClick={radioHandler} />
                  <span>{foodtype[i].name}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="col-md-9" style={{ padding: "0" }}>
          <div className="right-div">
            <div className="sort-search-div">
              <div className="sort-div">
                {sortname.map(function (p, i) {
                  return (
                    <>
                      <input type="button" className="sort-div-type" value={sortname[i]} onClick={sortHandler} />
                    </>
                  );
                })}
              </div>
              <div className="search-div">
                <input className="search-input" placeholder="검색어를 입력하세요." type="text" id="tbSearch" onChange={searchInputHandler} onKeyDown={(e)=> keyWordEnter(e)} value={inputData} />
                <input type="button" className="btn input-button" value="검색" onClick={listSearch} />
              </div>
            </div>
            <div className="container">
              <div className="row">
                {postList.map((record) => {
                  return (
                    <div className="col-md-4">
                      <Link to={`/recommend/${record.idx}`}>
                        <div class="container" style={{ padding: "0" }}>
                          <div className="list-div">
                            <div className="list-hover">
                              <span>{record.content}</span>
                            </div>

                            <img src={`http://192.168.0.3:20020/uploads/${record.img}`} className="list-img" />
                            <div className="res_inform">
                              <p>{record.title}</p>
                              <span>.{record.name}</span>
                              <br />
                              <span>{record.addr}</span>
                            </div>

                            <span style={{ textAlign: "right", padding: "0 8px 10px 0" }}>
                              조회수 {record.hits}. 리뷰수 {record.ReviewCnt}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default RecommendList;
