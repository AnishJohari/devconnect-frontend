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

  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  const loadPosts = async () => {
    const data = await getPosts();

    /* newest first */
    setPosts(data.reverse());
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

    setTitle("");
    setContent("");
    loadPosts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deletePost(id, token);
      loadPosts();
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="page-wrapper">
      {/* NAVBAR */}
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
        {/* HEADER */}
        <header className="feed-header">
          <h2 className="heading">DevConnect Feed</h2>
          <p className="subheading">
            Share your coding journey with the community.
          </p>
        </header>

        {/* CREATE POST */}
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
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handlePost}>
            {editId ? "Update Post" : "Create Post"}
          </button>
        </div>

        {/* POSTS */}
        <div className="posts-container">
          {posts.length === 0 ? (
            <p className="empty-msg">No posts yet. Be the first to share!</p>
          ) : (
            posts.map((p) => (
              <div className="post" key={p._id}>
                {/* Header */}
                <div className="post-top">
                  <div className="avatar">
                    {(p.user?.name || "D").charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h3>{p.title}</h3>
                    <p className="author">By @{p.user?.name || "Dev"}</p>
                  </div>
                </div>

                {/* Content */}
                <p className="post-text">{p.content}</p>

                {/* Actions */}
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
