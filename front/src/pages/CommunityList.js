import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../css/community_list.css";

// 커뮤니티 배너 컴포넌트
function CommunityBanner() {
  return (
    <div className="community-banner">
      <img src="http://192.168.0.3:20020/community/banner-image" alt="커뮤니티 배너" className="community-banner-image" />
    </div>
  );
}

// 커뮤니티 헤더 컴포넌트
function CommunityHeader({ onWriteClick, onSortChange, sortOrder }) {
  const [logStatus, setLogStatus] = useState(sessionStorage.getItem("logStatus"));
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    onSortChange(newSortOrder);
  };

  return (
    <div className="board-header">
      {logStatus == "Y" && (
        <button onClick={onWriteClick} className="board-write-button">
          커뮤니티 글쓰기
        </button>
      )}
      <h2 className="board-title">커뮤니티</h2>
      <div className="board-controls">
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="popular">인기순</option>
        </select>
      </div>
    </div>
  );
}

// 게시판 테이블 컴포넌트
function BoardTable({ posts, onPostClick }) {
  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <table className="board-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>제목</th>
          <th>글쓴이</th>
          <th>조회수</th>
          <th>작성일자</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.idx} onClick={() => onPostClick(post.idx)}>
            <td>{post.idx}</td>
            <td>{post.title}</td>
            <td>{post.userid}</td>
            <td>{post.hits}</td>
            <td>{formatDate(post.writedate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 페이지네이션 컴포넌트
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="board-pagination">
      {currentPage > 1 && <button onClick={() => onPageChange(currentPage - 1)}>이전</button>}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
        <button key={number} onClick={() => onPageChange(number)} className={currentPage === number ? "active" : ""}>
          {number}
        </button>
      ))}
      {currentPage < totalPages && <button onClick={() => onPageChange(currentPage + 1)}>다음</button>}
    </div>
  );
}

// 검색바 컴포넌트
function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="board-search-bar">
      <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="검색어 입력" />
      <button type="submit">검색</button>
    </form>
  );
}

// 메인 Board 컴포넌트
function CommunityList() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("latest");
  const [searchTerm, setSearchTerm] = useState("");
  const postsPerPage = 10;
  const navigate = useNavigate();

  // 게시글 데이터 가져오기
  const fetchPosts = useCallback(async () => {
    try {
      let url = `http://192.168.0.3:20020/community?sort=${sortOrder}`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }, [sortOrder, searchTerm]);

  // 컴포넌트 마운트 시 데이터 가져오기 및 주기적 업데이트
  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  // 정렬 순서 변경 핸들러
  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  // 검색 핸들러
  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 게시글 클릭 핸들러
  const handlePostClick = (postId) => {
    navigate(`/community/${postId}`);
  };

  // 현재 페이지의 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <main className="community_list_box">
      <div className="Community_Banner-container">
        <CommunityBanner />
      </div>
      <div className="board-container">
        <CommunityHeader onWriteClick={() => navigate("/community/create")} onSortChange={handleSortChange} sortOrder={sortOrder} />
        <BoardTable posts={currentPosts} onPostClick={handlePostClick} />
        <Pagination currentPage={currentPage} totalPages={Math.ceil(posts.length / postsPerPage)} onPageChange={paginate} />
        <SearchBar onSearch={handleSearch} />
      </div>
    </main>
  );
}

export default CommunityList;
