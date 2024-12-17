import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/community_create.css';
import axios from "axios";

function CommunityCreate() {
  // 상태 변수 정의
  const [title, setTitle] = useState(''); // 게시글 제목
  const [content, setContent] = useState(''); // 게시글 내용
  const navigate = useNavigate(); // 페이지 네비게이션을 위한 훅

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    const userid = sessionStorage.getItem("userid");

    const newPost = {
      userid, // user1 ~ user10 중 랜덤 선택
      title,
      content,
    };
    try {
      // 서버에 새 게시글 데이터 전송
      const response = await axios.post('http://192.168.0.3:20020/community', newPost);
 
        console.log(response);
        const createdPost =response.data;
        if (createdPost.idx) {
          console.log('게시글이 성공적으로 생성되었습니다:', createdPost);
          navigate('/community'); // 메인 페이지로 이동
        } else {
          console.error('게시글 생성 실패: 서버에서 ID를 반환하지 않았습니다.');
          alert('게시글 생성에 실패했습니다. 다시 시도해주세요.');
        }

        // const errorData = await response.json();
        // console.error('게시글 생성 실패:', errorData.error || '알 수 없는 오류');
        // alert(`게시글 생성에 실패했습니다: ${errorData.error || '알 수 없는 오류'}`);
      
    } catch (error) {
      console.error('Error creating post:', error);
      alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
  };

  return (
    <main>
    <div className="create-post">
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength="3000"
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="submit-button">등록</button>
        </div>
      </form>
    </div>
    </main>
  );
}

export default CommunityCreate;