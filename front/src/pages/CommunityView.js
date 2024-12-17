import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/community_view.css";
import axios from "axios";

function CommunityView() {
  // URL 파라미터에서 게시글 ID 가져오기
  const { id } = useParams();
  const navigate = useNavigate();

  // 상태 변수들 정의
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [hasViewed, setHasViewed] = useState(false);
  const [logStatus, setLogStatus] = useState(sessionStorage.getItem("logStatus"));
  const [userid, setUserid] = useState(sessionStorage.getItem("userid"));
  const [postUserImg, setPostUserImg] = useState("");
  let userImg = "";
  // 게시글 데이터 가져오기
  const fetchPost = useCallback(async () => {
    setTimeout(async () => {
      try {
        const response = await fetch(`http://192.168.0.3:20020/community/${id}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);

          setPostUserImg(await getImg(data.userid));
        } else {
          console.error("Failed to fetch post");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    }, 50);
  }, [id]);

  // 댓글 데이터 가져오기
  async function fetchComments() {
    setTimeout(async () => {
      try {
        const response = await fetch(`http://192.168.0.3:20020/community/comment/${id}`);
        if (response.ok) {
          const data = await response.json();
          await setComments(data);
          console.log(comments);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }, 10);
  }

  // 조회수 증가
  const incrementHits = useCallback(async () => {
    if (hasViewed) return;
    try {
      await fetch(`http://192.168.0.3:20020/community/${id}/incrementHits`, {
        method: "POST",
      });
      setHasViewed(true);
    } catch (error) {
      console.error("Error incrementing hits:", error);
    }
  }, [id, hasViewed]);

  // 컴포넌트 마운트 시 데이터 가져오기 및 주기적 업데이트
  useEffect(() => {
    fetchPost();
    fetchComments();
    incrementHits();
    // const interval = setInterval(() => {
    //   fetchPost();
    //   fetchComments();
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);

  // 댓글 제출 핸들러
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://192.168.0.3:20020/community/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comm_idx: id,
          userid: userid, // 실제 사용자 인증 시스템에 따라 변경 필요
          content: newComment,
        }),
      });
      if (response.ok) {
        await setNewComment("");
        await fetchComments();
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // 댓글 좋아요 핸들러
  const handleCommentLike = async (commentId) => {
    try {
      const response = await fetch(`http://192.168.0.3:20020/community/comment/${commentId}/like`, {
        method: "POST",
      });
      if (response.ok) {
        await fetchComments();
      } else {
        console.error("Failed to like comment");
      }
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  // 댓글 삭제 핸들러
  const handleCommentDelete = async (commentId) => {
    try {
      const response = await fetch(`http://192.168.0.3:20020/community/comment/${commentId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchComments();
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // 게시글 좋아요 핸들러
  const handlePostLike = async () => {
    try {
      const response = await fetch(`http://192.168.0.3:20020/community/${id}/like`, {
        method: "POST",
      });
      if (response.ok) {
        const updatedLikes = await response.json();
        setPost((prevPost) => ({ ...prevPost, like: updatedLikes.likes }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };
  async function getImg(userid) {
    const res = await axios.get(`http://192.168.0.3:20020/imgs/${userid}`, {
      responseType: "arraybuffer",
    });
    const base64ArrayBuffer = (arrayBuffer) => {
      let binary = "";
      const bytes = new Uint8Array(arrayBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    };

    const base64 = base64ArrayBuffer(res.data);
    const mimeType = res.headers["content-type"];
    userImg = `data:${mimeType};base64,${base64}`;
    return userImg;
  }
  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`http://192.168.0.3:20020/community/${id}`, {
          method: "DELETE",
        });
        console.log(response);
        if (response.ok) {
          alert("게시물이 삭제되었습니다.");
          navigate("/"); // 게시물 목록 페이지로 이동
        } else {
          alert("게시물 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("게시물 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!post) return <div>Loading...</div>;

  return (
    <main className="community_view">
      {/* <div className="save_del-action">
        {
         userid===post.userid&& (
          <>
        <button onClick={() => navigate(`edit`)} id="editPost">수정하기</button>
        <button onClick={handleDelete} id="deletePost">삭제하기</button>
          </>
        )}
      </div> */}

      <div className="post-header">
        <div id="post-left">
          <div className="post_user_data">
            <img src={postUserImg}></img>
            <span className="post-author">{post.userid}</span>
          </div>
          <span className="post-date">{formatDate(post.writedate)}</span>
        </div>
        <div className="save_del-action">
          {userid === post.userid && (
            <>
              <button onClick={() => navigate(`edit`)} id="editPost">
                수정하기
              </button>
              <button onClick={handleDelete} id="deletePost">
                삭제하기
              </button>
            </>
          )}
        </div>
      </div>
      <div className="view-post">
        <div id="text-content">
          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.content}</p>
          <div id="post-right">
            <span className="post-views">조회수 {post.hits}</span>
          </div>
        </div>
        <div className="comments-section">
          <h3>{comments.length}개의 댓글</h3>
          {logStatus == "Y" && (
            <form onSubmit={handleCommentSubmit}>
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="댓글을 입력하세요..." />
              <button type="submit" id="comment_button">
                댓글 작성
              </button>
            </form>
          )}
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.idx} className="comment">
                <div id="comment-left">
                  <div className="user_profile">
                    <img src={`http://192.168.0.3:20020/uploads/${comment.userimg}`}></img>
                  </div>
                  <span className="comment-author">{comment.userid}</span>
                  <p className="comment-content">{comment.content}</p>
                </div>
                <div id="comment-right">
                  <span className="comment-date">{formatDate(comment.writedate)}</span>
                  {/* <button onClick={() => handleCommentLike(comment.idx)}>
                  좋아요♥ ({comment.like})
                </button> */}
                  {(userid == comment.userid || userid == comment.post_userid) && (
                    <button onClick={() => handleCommentDelete(comment.idx)} id="commnet_delete_button">
                      삭제
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="back-action">
            <button onClick={() => navigate("/community")} id="returnList">
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CommunityView;
