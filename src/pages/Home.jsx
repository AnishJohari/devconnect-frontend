import { useEffect, useState } from "react";
import { getPosts, createPost, deletePost, updatePost } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Safe decoding of token
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  const loadPosts = async () => {
    const data = await getPosts();
    setPosts(data);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      loadPosts();
    }
  }, []);

  const handlePost = async () => {
    if (!token) return navigate("/login");
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      await updatePost(editId, { title, content }, token);
      setEditId(null);
    } else {
      await createPost({ title, content }, token);
    }

    loadPosts();
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(id, token);
      loadPosts();
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post._id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to form
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="page-wrapper">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-logo">
          <span className="logo-icon">{"</>"}</span> DevConnect
        </div>
        <div className="nav-actions">
          <button
            className="btn-secondary"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <button className="btn-outline" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="home-container">
        <header className="feed-header">
          <h2 className="heading">DevConnect Feed</h2>
          <p className="subheading">
            Share your coding journey with the community.
          </p>
        </header>

        {/* Form Section */}
        <div className="form-card">
          <div className="form-group">
            <label>Post Title</label>
            <input
              placeholder="What's on your coding mind?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              placeholder="Describe your achievement or question..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
            />
          </div>

          <button className="btn-primary" onClick={handlePost}>
            {editId ? "Update Post" : "Create Post"}
          </button>
        </div>

        {/* Feed Section */}
        <div className="posts-feed">
          {posts.length === 0 ? (
            <p className="empty-msg">No posts yet. Be the first to share!</p>
          ) : (
            posts.map((p) => (
              <div key={p._id} className="post-card">
                <div className="post-header">
                  <h3>{p.title}</h3>
                  <span className="post-author">
                    By @{p.user?.name || "Dev"}
                  </span>
                </div>
                <p className="post-content">{p.content}</p>

                {p.user?._id === userId && (
                  <div className="post-actions">
                    <button className="btn-edit" onClick={() => handleEdit(p)}>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
