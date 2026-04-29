const BASE_URL = "https://devconnect-backend-vq4a.onrender.com/api";

// helper for requests
async function request(endpoint, method = "GET", body, token) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + endpoint, options);
  return res.json();
}

// FOR REGISTRATION
export const signup = (data) =>
  request("/auth/signup", "POST", data);

//FOR LOGIN
export const login = (data) =>
  request("/auth/login", "POST", data);

// FOR GETTING POSTS
export const getPosts = () =>
  request("/posts");


//FOR CREATING POST
export const createPost = (data, token) =>
  request("/posts", "POST", data, token);

// DELETE POST
export const deletePost = (id, token) =>
  request(`/posts/${id}`, "DELETE", null, token);

// UPDATE POST
export const updatePost = (id, data, token) =>
  request(`/posts/${id}`, "PUT", data, token);

//FOR PROFILE UPDATE
export const updateProfile = (data, token) =>
  request("/auth/profile", "PUT", data, token);