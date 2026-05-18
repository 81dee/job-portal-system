import axios from "axios";


const API = axios.create({
    baseURL: "https://job-portal-backend-g2rd.onrender.com/api",
});

// attach token in every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});


export default API;