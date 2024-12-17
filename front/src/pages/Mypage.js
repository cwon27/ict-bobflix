import styled from 'styled-components';
// import backImg from '../img/clover.jpeg'
import "../css/mypage.css";
import React, { useState, useEffect } from 'react';
import axios from "axios";
import {Link} from 'react-router-dom';
// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 20px;
//   font-family: Arial, sans-serif;
//   background-color: #fff;
//   height: 100vh;
// `;


const Header = styled.header`
  width: 100%;
  background-color: #ffdd57;
  padding: 10px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Section = styled.section`
  display: flex;
  width: 1200px;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Box = styled.div`
  border-top: 2px solid #ff7300;
  padding-top: 20px;
  padding: 20px auto 0;
  flex: 1;
  margin-bottom: 20px
`;

// const ProfileBox = styled(Box)`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// `;

const InfoText = styled.div`
  margin-left: 10px;
`;

const Button = styled.button`
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
`;
  
function Mypage() {

    // 표시할 div를 결정하는 state 변수
    const [visibleDiv, setVisibleDiv] = useState('like_list');

    // h2 버튼 클릭 시 호출되는 함수
    const handleButtonClick = (divId) => {
      setVisibleDiv(divId);
    };

  const [userid, setUserid] = useState(sessionStorage.getItem("userid"));
  const [userInfo, setUserInfo] = useState({});
  const [community, setCommunity] = useState([]);
  const [recommend, setRecommend] = useState([]);
  window.updateUserInfo = (newInfo) => {
    setUserInfo(newInfo);
  };

  useEffect(() => {
    const storedInfo = localStorage.getItem('userInfo');
    if (storedInfo) {
      setUserInfo(JSON.parse(storedInfo));
    }
    getUserData();
    getCommunityData();
    getRecommendData();
  }, []);
  async function getUserData(){
    const result = await axios.get(`http://192.168.0.3:20020/mypage/${userid}`);
    setUserInfo(result.data);
  } 
  async function getCommunityData(){
    const result = await axios.get(`http://192.168.0.3:20020/mypage/${userid}/community`);
    console.log(result);
    setCommunity(result.data);
  } 
  async function getRecommendData(){
    const result = await axios.get(`http://192.168.0.3:20020/mypage/${userid}/recommend`);
    console.log(result);
    setRecommend(result.data);
  }
  const handleEditClick = () => {
    const width = 500;
    const height = 650;
    const left = window.innerWidth - width - 50;
    const top = 50;
    window.open('/mypage/edit', 'EditWindow', 
      `width=${width},height=${height},left=${left},top=${top},scrollbars=no`);
    };

    // if (newWindow) {
    //   newWindow.onload = () => {
    //     // 새 창이 로드된 후 스크롤바를 제거
    //     newWindow.document.body.style.overflow = 'hidden';
    //   };
    // }

  return (
    <main>

    <div id='container ' className='mypage_box'>
      <h1 style={{color:'#ffa600de'}}>My Home</h1>
      <div style={{ width: '100%', maxWidth: '1200px'  }}><h2>내 정보</h2></div>
      <Section>
        <Box>
          <div style={{ display: 'flex', justifyContent: 'space-between', height: '250px', marginBottom: '20px'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: '20px', height: '300px'}}>
              <img src={userInfo.userimg} style={{width:'200px', height:"200px", borderRadius:' 50%', border:'2px solid #ccc', marginBottom:"10px"}}/>
              <h3 style={{textAlign: 'center', fontSize: '20px',  marginBottom:"10px"}}>{userInfo.nickname}</h3>
              <div style={{border:'#ffa600de solid 1px', borderRadius:'20px', width:''}}>
                <h3 style={{textAlign: 'center', cursor: 'pointer', fontSize:'15px', margin:'0', padding: '8px 10px'}}onClick={handleEditClick}>수정하기</h3>
              </div>
            </div>
            <div style={{  width:'100%', height: '200px', backgroundColor:'#FFF0C9', borderRadius: '20px' , margin: '40px'}}>
              <div style={{ width:'100%', height: '200px', marginLeft: '80px', marginTop:'40px'}}>
                <h3 style={{textAlign: 'left'}}>☺︎ {userInfo.username}</h3>  
                <h3 style={{textAlign: 'left'}}>☎︎ {userInfo.tel}</h3>
                <h3 style={{textAlign: 'left'}}>✉︎ {userInfo.email}</h3>
              </div>
            </div> 
          </div>
        </Box>
      </Section>
      <Section className='my_post_box'>
        <div >
          <div id='head' style={{display:'flex'}}>
            <h2 style={{ color: visibleDiv=='like_list'?'#ff8c00de':"rgb(77, 77, 77)"}} onClick={() => handleButtonClick('like_list')}>나의 식당</h2>
            <h2 style={{ color: visibleDiv=='my_post'?'#ff8c00de':"rgb(77, 77, 77)"}} onClick={() => handleButtonClick('my_post')}>나의 게시물</h2>
          </div>
        <Box style={{width:'1200px'}}>
          {visibleDiv == 'like_list' && (
            <div id='like_list'>
              {recommend.map((record) => {
                        return (
                          <>
                            <div className="" style={{ padding: "0px" }}>
                            <Link class="mypage_recommend_link" to={`/recommend/${record.idx}`}>
                              <div className="container">
                                <div className="res_img">
                                  <img className='mypage_recommend_img' src={`http://192.168.0.3:20020/uploads/${record.img}`} />
                                  <span>{record.title}</span>
                                </div>
                              </div>
                            </Link>
                            </div>
                          </>
                        );
                      })}

            </div>
          )}
          {visibleDiv == 'my_post' && (
          <div id='my_post'>
            {
              community.map((post)=>
                (

                <div className="posts">
                  <Link to={`/community/${post.idx}`}>
                  <div id='title'>{post.title}</div>
                  </Link>
                  <div id='hit'>👀{post.hits}</div>
                </div>
                )
              )
            }
            {/* {
              community.map((post)=>
                (

                <div className="posts">
                  <Link to={`/community/${post.idx}`}>
                  <div id='title'>{post.title}</div>
                  </Link>
                  <div id='hit'>👀{post.hits}</div>
                </div>
                )
              )
            } */}
          </div>
          )}
        </Box> 
        </div>
      </Section>
    </div>
  </main>
  );
}
export default Mypage;





