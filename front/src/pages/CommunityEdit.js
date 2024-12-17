// EditPost.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/community_edit.css';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://192.168.0.3:20020/community/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setContent(data.content);
        } else {
          console.error('Failed to fetch post');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://192.168.0.3:20020/community/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        // 수정 성공 시 해당 게시물의 상세 페이지로 이동
        navigate(`/community/${id}`);
      } else {
        console.error('Failed to update post');
        alert('게시물 수정에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
  };

  return (
    <main className='community_edit'>

    <div className="edit-post">
      <h2>게시글 수정</h2>
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
          <button type="submit" className="submit-button">수정</button>
          <button type="button" onClick={() => navigate(`/community/${id}`)} className="cancel-button">취소</button>
        </div>
      </form>
    </div>
            </main>
  );
}

export default EditPost;