import { useEffect, useState } from "react";
import { getPosts, createPost, deletePost, updatePost } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // get logged in user id from token
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
    await deletePost(id, token);
    loadPosts();
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post._id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h2>DevConnect Feed</h2>

      <div style={{ display: "flex", gap: "10px" }}>
  <button onClick={logout} style={{ width: "120px" }}>
    Logout
  </button>

  <button
    onClick={() => navigate("/profile")}
    style={{ width: "120px" }}
  >
    Profile
  </button>
</div>

      <div
        style={{
          marginTop: "20px",
          background: "white",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button onClick={handlePost}>
          {editId ? "Update Post" : "Create Post"}
        </button>
      </div>

      {posts.map((p) => (
        <div key={p._id} className="post">
          <h3>{p.title}</h3>
          <p>{p.content}</p>
          <small>By {p.user?.name}</small>

          {p.user?._id === userId && (
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => handleEdit(p)}
                style={{ marginRight: "10px" }}
              >
                Edit
              </button>

              <button onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
