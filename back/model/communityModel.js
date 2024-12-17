const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tiger1234',
    database: 'mini1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

const getCommunity =  async(req, res) => {
    
    const { sort, search } = req.query;
    let query = 'SELECT * FROM community';
    let queryParams = [];
  
    // 검색 조건 추가
    if (search) {
      query += ' WHERE title LIKE ? OR content LIKE ?';
      queryParams.push(`%${search}%`, `%${search}%`);
    }
  
    // 정렬 조건 추가
    if (sort === 'latest') {
      query += ' ORDER BY writedate DESC';
    } else if (sort === 'oldest') {
      query += ' ORDER BY writedate ASC';
    } else if (sort === 'popular') {
      query += ' ORDER BY hits DESC';
    }
  
    try {
      const [rows] = await pool.query(query, queryParams);
      const formattedRows = rows.map(row => ({
        ...row,
        writedate: new Date(row.writedate).toISOString().split('T')[0]
      }));
      res.json(formattedRows);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const postCommunity = async (req, res) => {
    console.log(req.body);
    const { userid, title, content } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO community (userid, title, content) VALUES (?, ?, ?)',
        [userid, title, content]
      );
      const [newPost] = await pool.query('SELECT * FROM community WHERE idx = ?', [result.insertId]);
      res.status(201).json(newPost[0]);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const getPost = async (req, res) => {
  const postId = req.params.id;

    try {
      const [rows] = await pool.query('select idx, title, content, writedate, hits, m.userid, userimg  from community c join member m on m.userid=c.userid where idx=?', [postId]);
      if (rows.length > 0) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
const postSetLike = async (req, res) => {
    const postId = req.params.id;
    try {
      await pool.query('UPDATE community SET `like` = `like` + 1 WHERE idx = ?', [postId]);
      const [updatedPost] = await pool.query('SELECT `like` FROM community WHERE idx = ?', [postId]);
      res.json({ likes: updatedPost[0].like });
    } catch (error) {
      console.error('Error updating post like:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
const postSetHit = async (req, res) => {
    const postId = req.params.id;
    try {
      await pool.query('UPDATE community SET hits = hits + 1 WHERE idx = ?', [postId]);
      res.json({ message: 'Hits incremented successfully' });
    } catch (error) {
      console.error('Error incrementing hits:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
const getComment = async (req, res) => {

    const { id } = req.params;

    try {
      const [newComment] = await pool.query('select cc.idx, cc.comm_idx, cc.userid, cc.content, cc.grade, cc.like, cc.writedate, c.userid "post_userid", m.userimg from comm_comment cc join community c on cc.comm_idx=c.idx join member m on cc.userid=m.userid where cc.comm_idx = ? order by cc.writedate desc;', [id]);
      console.log(newComment);
      res.status(201).json(newComment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
const postComment = async (req, res) => {
  console.log("hihi get");
    const { comm_idx, userid, content } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO comm_comment (comm_idx, userid, content) VALUES (?, ?, ?)',
        [comm_idx, userid, content]
      );
      const [newComment] = await pool.query('SELECT * FROM comm_comment WHERE idx = ?', [result.insertId]);
      res.status(201).json(newComment[0]);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
const postSetCommentLike = async (req, res) => {
    const commentId = req.params.id;
    try {
      await pool.query('UPDATE comm_comment SET `like` = `like` + 1 WHERE idx = ?', [commentId]);
      res.json({ message: 'Like updated successfully' });
    } catch (error) {
      console.error('Error updating comment like:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const deleteComment = async (req, res) => {
    const commentId = req.params.id;
    try {
      const [result] = await pool.query('DELETE FROM comm_comment WHERE idx = ?', [commentId]);
      if (result.affectedRows > 0) {
        res.json({ message: 'Comment deleted successfully' });
      } else {
        res.status(404).json({ error: 'Comment not found' });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

const putCommunity =  async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  try {
    await pool.query(
      'UPDATE community SET title = ?, content = ? WHERE idx = ?',
      [title, content, postId]
    );
    const [updatedPost] = await pool.query('SELECT * FROM community WHERE idx = ?', [postId]);
    if (updatedPost.length > 0) {
      res.json(updatedPost[0]);
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

const deleteCommunity = async(req, res)=>{
  const postId = req.params.id;
  try {
    // 먼저 관련된 댓글을 삭제합니다
    await pool.query('DELETE FROM comm_comment WHERE comm_idx = ?', [postId]);
    
    // 그 다음 게시물을 삭제합니다
    const [result] = await pool.query('DELETE FROM community WHERE idx = ?', [postId]);
    
    if (result.affectedRows > 0) {
      res.json({ message: 'Post deleted successfully' });
    } else {
      res.status(404).json({ error: 'Post not found' });
    }
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

  
}





module.exports = {getCommunity, postCommunity, getPost, postSetLike, postSetHit, getComment, postComment, postSetCommentLike, deleteComment, putCommunity, deleteCommunity}